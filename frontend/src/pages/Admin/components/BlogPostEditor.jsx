import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../../components/Layouts/BlogLayout/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuLoaderCircle,
  LuSave,
  LuSend,
  LuTrash2,
} from "react-icons/lu";
import CoverImageSelector from "../../../components/Inputs/CoverImageSelector";
import MDEditor, { commands } from "@uiw/react-md-editor";
import TagInput from "../../../components/Inputs/TagInput";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths.js";
import Modal from "../../../components/Modal.jsx";
import GenerateBlogPostForm from "./GenerateBlogPostForm.jsx";
import { toast } from "react-hot-toast";
import { getToastMessageByType } from "../../../utils/helper.js";
import DeleteAlertContent from "../../../components/DeleteAlertContent.jsx";
import { Image as ImageIcon } from "lucide-react";
import SwitchButton from "../../Blog/components/SwitchButton.jsx";
import PhotosSelector from "../../../components/Inputs/PhotosSelector.jsx";
import uploadImage from "../../../utils/uploadImage.js";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const BlogPostEditor = ({ isEdit }) => {
  const [images, setImages] = useState([]);
  const [prevImages, setPrevImages] = useState([]);
  const navigate = useNavigate();
  const { postSlug = "" } = useParams();
  // const [switchButton, setSwitchButton] = useState("Event");
  const [photo, setPhoto] = useState(1);
  const [showPhotos, setShowPhotos] = useState(false);

  const [postData, setPostData] = useState({
    id: "",
    title: "",
    content: "",
    images: images,
    prevImages: prevImages,
    coverImageUrl: "",
    coverPreview: "",
    tags: [],
    isDraft: "",
    generatedByAI: false,
  });

  const [postIdeas, setPostIdeas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openBlogPostGenForm, setOpenBlogPostGenForm] = useState({
    open: false,
    data: null,
  });
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setPostData((prevData) => ({ ...prevData, [key]: value }));
  };

  // Generate Blog Post Ideas using AI
  const generatePostIdeas = async () => {
    setIdeaLoading(true);
    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_BLOG_POST_IDEAS,
        {
          topics:
            "Registration, Scholarships, Programming, Campus Events, Health & Safety, Library/IT Notices",
        },
      );
      const generatedIdeas = aiResponse.data;
      if (generatedIdeas?.length > 0) {
        setPostIdeas(generatedIdeas);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setIdeaLoading(false);
    }
  };

  // Handle Blog Post Publish
  const handlePublish = async (isDraft) => {
    let coverImageUrl = "";

    if (!postData.title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!postData.content.trim()) {
      setError("Please enter some content.");
      return;
    }

    if (!isDraft) {
      // if (!isEdit && !postData.coverImageUrl) {
      //   setError("Please select cover image.");
      //   return;
      // }
      if (!postData.tags.length) {
        setError("Please add some tags.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      // Check if a new image was uploaded (File Type)
      if (postData.coverImageUrl instanceof File) {
        const imgUploadRes = await uploadImage(postData.coverImageUrl);
        coverImageUrl = imgUploadRes.imageUrl || "";
      } else {
        coverImageUrl = postData.coverPreview;
      }

      let imgSample = [];

      if (images.length > 0) {
        imgSample = await Promise.all(
          images.map(async (image) => {
            if (image instanceof File) {
              const img = await uploadImage(image);
              return img.imageUrl;
            } else {
              return image;
            }
          }),
        );
      }

      // console.log("Img Sample", imgSample);

      const reqPayload = {
        title: postData.title,
        content: postData.content,
        coverImageUrl,
        images: imgSample,
        tags: postData.tags,
        isDraft: isDraft ? true : false,
        generatedByAI: true,
      };

      // console.log("Pay Load", reqPayload);

      const response = isEdit
        ? await axiosInstance.put(
            API_PATHS.POSTS.UPDATE(postData.id),
            reqPayload,
          )
        : await axiosInstance.post(API_PATHS.POSTS.CREATE, reqPayload);

      if (response.data) {
        toast.success(
          getToastMessageByType(
            isDraft ? "draft" : isEdit ? "edit" : "published",
          ),
        );
        navigate("/admin/posts");
      }
    } catch (error) {
      setError("Failed to publish post. Please try again.");
      console.error("Error publishing the post.", error);
    } finally {
      setLoading(false);
    }
  };

  // Get Post Data by Slug
  const fetchPostDetailsBySlug = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_SLUG(postSlug),
      );

      if (response.data) {
        const data = response.data;

        setPostData((prevState) => ({
          ...prevState,
          id: data._id,
          title: data.title,
          content: data.content,
          images: data.images,
          prevImages: data.images,
          coverPreview: data.coverImageUrl,
          tags: data.tags,
          isDraft: data.isDraft,
          generatedByAI: data.generatedByAI,
        }));
        setImages(data.images);
        setPrevImages(data.images);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Delete Blog Post
  const deletePost = async () => {
    try {
      await axiosInstance.delete(API_PATHS.POSTS.DELETE(postData.id));

      toast.success("Post deleted successfully!");
      setOpenDeleteAlert(false);
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Cloudinary image upload
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      let newImagesMarkdown = "";

      for (const file of files) {
        const imgUploadRes = await uploadImage(file);
        const imageUrl = imgUploadRes.imageUrl;

        newImagesMarkdown += `\n![image](${imageUrl})\n`;
      }

      const newContent = (postData.content || "") + newImagesMarkdown;

      handleValueChange("content", newContent);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  // const customImageCommand = {
  //   name: "image",
  //   keyCommand: "image",
  //   buttonProps: { "aria-label": "Insert image" },
  //   icon: <ImageIcon size={18} />,
  //   execute: () => {
  //     fileInputRef.current.click();
  //   },
  // };

  useEffect(() => {
    if (isEdit) {
      fetchPostDetailsBySlug();
    } else {
      //generatePostIdeas()
    }

    return () => {};
  }, []);

  useEffect(() => {
    setPostData((prev) => ({
      ...prev,
      images,
    }));
  }, [images]);

  return (
    <DashboardLayout activeMenu="Blog Posts">
      <div
        className={`${showPhotos ? "flex" : "hidden"} justify-center fixed z-50 top-0 left-0 w-screen h-screen bg-slate-50/60 backdrop-blur-md`}
      >
        <button
          onClick={() => {
            setShowPhotos(false);
          }}
          className="absolute right-10 top-5 text-red-600 font-bold cursor-pointer bg-white px-3 py-1 rounded-lg hover:text-white hover:bg-red-600 active:scale-90 duration-200"
        >
          X
        </button>
        <section className="flex md:p-10 justify-center items-center">
          <button
            onClick={() => {
              photo === 1 ? "" : setPhoto(photo - 1);
            }}
            className="md:p-10 active:text-blue-700 rounded-l-lg cursor-pointer duration-200"
          >
            <FaArrowLeft size={25} />
          </button>
          {postData.images.slice(photo - 1, photo).map((img) => (
            <section className="w-80 md:w-full md:h-full">
              <button
                onClick={() => postData.images.pop(img)}
                className="text-lg md:text-base fixed top-5 right-25 bg-white px-3 py-2 text-red-700 rounded-lg cursor-pointer active:scale-95 duration-200"
              >
                <LuTrash2 />
              </button>
              <img
                src={img}
                alt="No Photo"
                className="w-80 md:w-full md:h-full rounded-lg"
              />
            </section>
          ))}
          <button
            onClick={() => {
              photo === postData.images.length ? "" : setPhoto(photo + 1);
            }}
            className="md:p-10 active:text-blue-700 rounded-r-lg cursor-pointer duration-200"
          >
            <FaArrowRight size={25} />
          </button>
        </section>
      </div>
      <div className="my-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4">
          <div className="form-card p-6 col-span-12 md:col-span-8">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-medium">
                {!isEdit ? "Add New Post" : "Edit Post"}
              </h2>

              <div className="flex items-center gap-3">
                {isEdit && (
                  <button
                    className="flex items-center gap-2.5 text-[13px] font-medium text-red-600 rounded-lg px-1.5 md:px-3 py-1 md:py-[3px] border border-red-500 cursor-pointer hover:text-white hover:bg-red-600 hover:scale-105 active:scale-95 duration-200"
                    disabled={loading}
                    onClick={() => setOpenDeleteAlert(true)}
                  >
                    <LuTrash2 className="text-lg" />{" "}
                    <span className="hidden md:block">Delete</span>
                  </button>
                )}

                <button
                  className="flex items-center gap-2.5 text-[13px] font-medium text-red-600 rounded-lg px-1.5 md:px-3 py-1 md:py-[3px] border border-red-500 cursor-pointer hover:text-white hover:bg-red-600 hover:scale-105 active:scale-95 duration-200"
                  disabled={loading}
                  onClick={() => navigate("/admin/posts")}
                >
                  <LuArrowLeft className="text-2xl md:text-lg" />{" "}
                  <span className="hidden md:block">Cancel</span>
                </button>
                <button
                  className="flex items-center gap-2.5 text-[13px] text-blue-400 border border-blue-400 font-medium rounded-lg px-1.5 md:px-3 py-1 md:py-[3px] cursor-pointers hover:text-white hover:bg-blue-400 hover:scale-105 active:scale-95 duration-200"
                  disabled={loading}
                  onClick={() => handlePublish(true)}
                >
                  <LuSave className="text-2xl md:text-lg" />{" "}
                  <span className="hidden md:block">Draft</span>
                </button>

                <button
                  className="flex items-center gap-2.5 text-[13px] text-blue-700 font-medium rounded-lg px-3 py-[3px] border border-blue-700 hover:text-white hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer duration-200"
                  disabled={loading}
                  onClick={() => handlePublish(false)}
                >
                  {loading ? (
                    <LuLoaderCircle className="animate-spin text-[15px]" />
                  ) : (
                    <LuSend className="text-2xl md:text-lg" />
                  )}{" "}
                  <span className="hidden md:block">Publish</span>
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Post Title
              </label>

              <input
                placeholder="Enter Title"
                className="form-input"
                value={postData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <CoverImageSelector
                image={postData.coverImageUrl}
                setImage={(value) => handleValueChange("coverImageUrl", value)}
                preview={postData.coverPreview}
                setPreview={(value) => handleValueChange("coverPreview", value)}
              />
              <PhotosSelector
                images={images}
                setImages={setImages}
                previews={prevImages}
                setPreviews={setPrevImages}
                isClick={() => {
                  setShowPhotos(true);
                }}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Content
              </label>

              <div data-color-mode="light" className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <MDEditor
                  value={postData.content}
                  onChange={(data) => {
                    handleValueChange("content", data);
                  }}
                  commands={[
                    commands.heading,
                    commands.bold,
                    commands.italic,
                    commands.strikethrough,
                    commands.divider,
                    commands.hr,
                    commands.unorderedListCommand,
                    commands.orderedListCommand,
                    commands.divider,
                    commands.link,
                    commands.divider,
                    commands.code,
                  ]}
                  textareaProps={{
                    placeholder: "Start typing here...",
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-500 mt-2 px-1">
              <span>
                {postData.content?.split(/\s+/).filter(Boolean).length || 0}{" "}
                words
              </span>
              <span>{postData.content?.length || 0} characters</span>
            </div>

            <div className="mt-3">
              <section className="text-xs font-medium text-slate-600 flex justify-between">
                <h1>Tags</h1>
                {/* <SwitchButton
                  label={switchButton}
                  condition={switchButton}
                  setter={setSwitchButton}
                  isEdit={isEdit}
                /> */}
              </section>
              <TagInput
                tags={postData.tags || [""]}
                setTags={(data) => {
                  handleValueChange("tags", data);
                }}
              />
            </div>
          </div>

          {/* AI Post Generation */}
          {/* {!isEdit && (
            <div className='form-card col-span-12 md:col-span-4 p-0'>
              <div className='flex items-center justify-between px-6 pt-6'>
                <h4 className='text-sm md:text-base font-medium inline-flex items-center gap-2'>
                  <span className='text-sky-600'>
                    <LuSparkles />
                  </span>
                  Ideas for you next post
                </h4>

                <button
                  className='bg-linear-to-r from-sky-500 to-cyan-400 text-[13px] font-semibold text-white px-3 py-1 rounded hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-sky-200'
                  onClick={() =>
                    setOpenBlogPostGenForm({ open: true, data: null })
                  }
                >
                  Generate New
                </button>
              </div>

              <div>
                {ideaLoading ? (
                  <div className='p-5'>
                    <SkeletonLoader />
                  </div>
                ) : (
                  postIdeas.map((idea, index) => (
                    <BlogPostIdeaCard
                      key={`idea_${index}`}
                      title={idea.title || ""}
                      description={idea.description || ""}
                      tags={idea.tags || []}
                      tone={idea.tone || "casual"}
                      onSelect={() =>
                        setOpenBlogPostGenForm({ open: true, data: idea })
                      }
                    />
                  ))
                )}
              </div>
            </div>
          )} */}
        </div>
      </div>

      <Modal
        isOpen={openBlogPostGenForm?.open}
        onClose={() => {
          setOpenBlogPostGenForm({ open: false, data: null });
        }}
        hideHeader
      >
        <GenerateBlogPostForm
          contentParams={openBlogPostGenForm?.data || null}
          setPostContent={(title, content) => {
            const postInfo = openBlogPostGenForm?.data || null;
            setPostData((prevState) => ({
              ...prevState,
              title: title || prevState.title,
              content: content,
              tags: postInfo.tags || prevState.tags,
              generatedByAI: true,
            }));
          }}
          handleCloseForm={() => {
            setOpenBlogPostGenForm({ open: false, data: null });
          }}
        />
      </Modal>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => {
          setOpenDeleteAlert(false);
        }}
        title="Delete Alert"
      >
        <div className="w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this post?"
            onDelete={() => deletePost()}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BlogPostEditor;
