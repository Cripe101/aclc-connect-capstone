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
import uploadImage from "../../../utils/uploadImage.js";
import { toast } from "react-hot-toast";
import { getToastMessageByType } from "../../../utils/helper.js";
import DeleteAlertContent from "../../../components/DeleteAlertContent.jsx";
import { Image as ImageIcon } from "lucide-react";
import SwitchButton from "../../Blog/components/Switchbutton.jsx";

const BlogPostEditor = ({ isEdit }) => {
  const navigate = useNavigate();
  const { postSlug = "" } = useParams();
  const [switchButton, setSwitchButton] = useState(["Event"]);

  const [postData, setPostData] = useState({
    id: "",
    title: "",
    content: "",
    coverImageUrl: "",
    coverPreview: "",
    tags: switchButton,
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
      if (!isEdit && !postData.coverImageUrl) {
        setError("Please select cover image.");
        return;
      }
      if (isEdit && !postData.coverImageUrl && !postData.coverPreview) {
        setError("Please select cover image.");
        return;
      }
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

      const reqPayload = {
        title: postData.title,
        content: postData.content,
        coverImageUrl,
        tags: postData.tags,
        isDraft: isDraft ? true : false,
        generatedByAI: true,
      };

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
          coverPreview: data.coverImageUrl,
          tags: data.tags,
          isDraft: data.isDraft,
          generatedByAI: data.generatedByAI,
        }));
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
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imgUploadRes = await uploadImage(file);
      const imageUrl = imgUploadRes.imageUrl;

      const newContent = (postData.content || "") + `\n![image](${imageUrl})\n`;

      handleValueChange("content", newContent);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const customImageCommand = {
    name: "image",
    keyCommand: "image",
    buttonProps: { "aria-label": "Insert image" },
    icon: <ImageIcon size={18} />,
    execute: () => {
      fileInputRef.current.click();
    },
  };

  useEffect(() => {
    if (isEdit) {
      fetchPostDetailsBySlug();
    } else {
      //generatePostIdeas()
    }

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Blog Posts">
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
                    className="flex items-center gap-2.5 text-[13px] font-medium text-rose-500 bg-rose-50/60 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-rose-50 hover:border-rose-300 cursor-pointer hover:scale-[1.02] transition-all"
                    disabled={loading}
                    onClick={() => setOpenDeleteAlert(true)}
                  >
                    <LuTrash2 className="text-sm" />{" "}
                    <span className="hidden md:block">Delete</span>
                  </button>
                )}

                <button
                  className="flex items-center gap-2.5 text-[13px] font-medium text-red-500 bg-red-50/60 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-red-100 hover:border-red-400 cursor-pointer hover:scale-[1.02] transition-all"
                  disabled={loading}
                  onClick={() => navigate("/admin/posts")}
                >
                  <LuArrowLeft className="text-sm" />{" "}
                  <span className="hidden md:block">Cancel</span>
                </button>
                <button
                  className="flex items-center gap-2.5 text-[13px] font-medium text-sky-500 bg-sky-50/60 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-sky-100 hover:border-sky-400 cursor-pointer hover:scale-[1.02] transition-all"
                  disabled={loading}
                  onClick={() => handlePublish(true)}
                >
                  <LuSave className="text-sm" />{" "}
                  <span className="hidden md:block">Save as Draft</span>
                </button>

                <button
                  className="flex items-center gap-2.5 text-[13px] font-medium text-sky-600 hover:text-white hover:bg-linear-to-r hover:from-sky-500 hover:to-indigo-500 rounded px-3 py-[3px] border border-sky-500 hover:border-sky-50 cursor-pointer transition-all"
                  disabled={loading}
                  onClick={() => handlePublish(false)}
                >
                  {loading ? (
                    <LuLoaderCircle className="animate-spin text-[15px]" />
                  ) : (
                    <LuSend className="text-sm" />
                  )}{" "}
                  Publish
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

            <div className="mt-4">
              <CoverImageSelector
                image={postData.coverImageUrl}
                setImage={(value) => handleValueChange("coverImageUrl", value)}
                preview={postData.coverPreview}
                setPreview={(value) => handleValueChange("coverPreview", value)}
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
                    // customImageCommand,
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
                <SwitchButton
                  label={switchButton}
                  condition={switchButton}
                  setter={setSwitchButton}
                  isEdit={isEdit}
                />
              </section>
              <TagInput
                tags={postData.tags || []}
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
