import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/Layouts/BlogLayout/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import {
  LuTrash2,
  LuPencil,
  LuSearch,
  LuLoaderCircle,
  LuPlus,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import Modal from "../../../components/Modal";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredUsersM, setFilteredUsersM] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    role: "",
  });
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [showAddPwdVisibility, setShowAddPwdVisibility] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageM, setCurrentPageM] = useState(1);
  const usersPerPage = 16;
  const usersPerPageM = 6;

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // For Mobile
  const totalPagesM = Math.ceil(filteredUsersM.length / usersPerPageM);
  const indexOfLastUserM = currentPageM * usersPerPageM;
  const indexOfFirstUserM = indexOfLastUserM - usersPerPageM;
  const currentUsersM = filteredUsersM.slice(
    indexOfFirstUserM,
    indexOfLastUserM,
  );

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_ALL_USERS);
      setUsers(response.data);
      setFilteredUsers(response.data);
      setFilteredUsersM(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
    }
  };

  // Search users
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);

    if (query.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user?.name.toLowerCase().includes(query.toLowerCase()) ||
          user?.email.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  };

  // Open edit modal
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user?.email,
      bio: user.bio || "",
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Open add modal
  const handleAddClick = () => {
    setAddForm({ name: "", email: "", password: "", role: "" });
    setIsAddModalOpen(true);
  };

  // Update user
  const handleUpdateUser = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_USER(selectedUser._id),
        formData,
      );
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      getAllUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(API_PATHS.AUTH.DELETE_USER(selectedUser._id));
      toast.success("User deleted successfully");
      setIsDeleteModalOpen(false);
      getAllUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  // Create user
  const handleCreateUser = async () => {
    try {
      setIsLoading(true);
      const payload = {
        name: addForm.name,
        email: addForm.email,
        password: addForm.password,
        role: addForm.role,
      };

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        payload,
      );

      if (addForm.role === "admin") {
        await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER(response.data._id), {
          role: "admin",
        });
      }

      toast.success("User created successfully");
      setIsAddModalOpen(false);
      getAllUsers();

      return response.data;
    } catch (error) {
      toast.error("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // const createUserMutation = useMutation({
  //   mutationFn: createUser,
  //   onSuccess: () => {
  //     toast.success("User Successfully Created");
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  // });

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const payload = {
  //     name: addForm.name,
  //     username: addForm.username,
  //     password: addForm.password,
  //     role: addForm.role,
  //   };
  //   createUserMutation.mutate(payload);
  // };

  return (
    <DashboardLayout activeMenu="Users">
      <div className="bg-white p-3 rounded-lg border border-gray-200/50 mt-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <h2 className="text-2xl font-bold">User Management</h2>
          </div>
          <section className="flex flex-row-reverse gap-5">
            <div className="relative w-full md:w-64">
              <LuSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full outline-none"
              />
            </div>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 cursor-pointer bg-blue-700 font-bold text-white px-4 py-2 rounded-xl active:bg-blue-800 active:scale-90 hover:bg-blue-800 duration-200"
            >
              <p className="font-bold block md:hidden">
                <LuPlus />
              </p>
              <p className="hidden md:block">Add</p>
              User
            </button>
          </section>
        </div>

        {isLoading && filteredUsers.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <LuLoaderCircle className="animate-spin text-2xl text-sky-500" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div>
            <div className="">
              <span className="">
                {/* Desktop */}
                <span className="w-full md:grid hidden grid-cols-4 gap-2 md:gap-3">
                  {currentUsers.map((user) => (
                    <section
                      key={user._id}
                      className={`flex flex-col py-3 bg-linear-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-100 rounded-xl transition-colors duration-600`}
                    >
                      <h1 className="flex items-center justify-between w-full mb-5 pr-3 pl-2">
                        <p className="flex gap-3">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="flex cursor-pointer items-center gap-1 border border-blue-600 text-blue-600 px-3 py-1 rounded-xl hover:bg-blue-600 hover:text-white active:bg-blue-600 active:text-white active:scale-90 duration-300"
                            title="Edit User"
                          >
                            <LuPencil className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="flex cursor-pointer items-center gap-1 border border-red-600 text-red-600 px-3 py-1 rounded-xl hover:bg-red-600 hover:text-white active:bg-red-600 active:text-white active:scale-90 duration-300"
                            title="Delete User"
                          >
                            <LuTrash2 className="text-lg" />
                          </button>
                        </p>
                        <p
                          className={`py-1 rounded-full text-xs font-bold font-display ${
                            user.role === "admin"
                              ? "px-2.5 bg-blue-50 text-blue-700"
                              : user.role === "offices"
                                ? "px-2.5 bg-purple-100 text-purple-700"
                                : user.role === "faculty"
                                  ? "px-2.5 bg-yellow-100 text-yellow-700"
                                  : "px-2.5 bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role}
                        </p>
                      </h1>
                      <section className="px-3">
                        <span className="flex gap-3 items-center">
                          <img
                            src={user.profileImageUrl}
                            className="w-10 h-10 rounded-full object-cover object-center"
                          />
                          <h1 className="">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-slate-500">
                              {user.email}
                            </p>
                          </h1>
                        </span>
                      </section>
                    </section>
                  ))}
                </span>

                {/* Mobile */}
                <span className="w-full grid md:hidden gap-2">
                  {currentUsersM.map((user) => (
                    <section
                      key={user._id}
                      className={`flex flex-col py-3 bg-linear-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-100 rounded-xl transition-colors duration-600`}
                    >
                      <h1 className="flex items-center justify-between w-full mb-5 pr-3 pl-2">
                        <p className="flex gap-3">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="flex cursor-pointer items-center gap-1 border border-blue-600 text-blue-600 px-3 py-1 rounded-xl hover:bg-blue-600 hover:text-white active:bg-blue-600 active:text-white active:scale-90 duration-300"
                            title="Edit User"
                          >
                            <LuPencil className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="flex cursor-pointer items-center gap-1 border border-red-600 text-red-600 px-3 py-1 rounded-xl hover:bg-red-600 hover:text-white active:bg-red-600 active:text-white active:scale-90 duration-300"
                            title="Delete User"
                          >
                            <LuTrash2 className="text-xl" />
                          </button>
                        </p>
                        <p
                          className={`py-1 rounded-full text-xs font-bold font-display ${
                            user.role === "admin"
                              ? "px-2.5 bg-blue-50 text-blue-700"
                              : user.role === "offices"
                                ? "px-2.5 bg-purple-100 text-purple-700"
                                : user.role === "faculty"
                                  ? "px-2.5 bg-yellow-100 text-yellow-700"
                                  : "px-2.5 bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role}
                        </p>
                      </h1>
                      <section className="px-3">
                        <span className="flex gap-3 items-center">
                          <img
                            src={user.profileImageUrl}
                            className="w-10 h-10 rounded-full object-cover object-center"
                          />
                          <h1 className="">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-slate-500">
                              {user.email}
                            </p>
                          </h1>
                        </span>
                      </section>
                    </section>
                  ))}
                </span>

                {/* Desktop */}
                {totalPages > 1 && (
                  <div className="md:flex hidden justify-center items-center gap-2 mt-5 flex-wrap">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`py-0.5 rounded-lg text-white font-medium cursor-pointer ${
                          currentPage === index + 1
                            ? "bg-blue-800 px-2.5"
                            : "bg-blue-400 px-1.5"
                        } duration-200`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}

                {/* Mobile */}
                {totalPagesM > 1 && (
                  <div className="flex md:hidden justify-center items-center gap-2 my-5 flex-wrap">
                    {[...Array(totalPagesM)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPageM(index + 1)}
                        className={`py-1 rounded-lg text-white text-xl font-medium cursor-pointer ${
                          currentPageM === index + 1
                            ? "bg-blue-800 px-3"
                            : "bg-blue-400 px-2"
                        } duration-200`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </span>
            </div>
            {/* Mobile view */}
            {/* <section className="md:hidden grid grid-cols-1 gap-3">
              {currentUsers.map((user) => (
                <section
                  key={user._id}
                  className="grid grid-cols-2 justify-between bg-blue-50 p-3 rounded-lg"
                >
                  <section className="flex flex-col gap-5">
                    <h1 className="font-bold">{user.name}</h1>
                    <h1 className="truncate max-w-40">{user.email}</h1>
                  </section>
                  <section className="flex flex-col gap-5">
                    <h1
                      className={`${user.role.toLowerCase() === "admin" ? "text-blue-700 font-extrabold" : "font-normal text-blue-700"} font-display text-center bg-white rounded-lg`}
                    >
                      {user.role}
                    </h1>
                    <span className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="flex cursor-pointer items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-800 duration-200"
                          title="Edit User"
                        >
                          <LuPencil className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="flex cursor-pointer items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                          title="Delete User"
                        >
                          <LuTrash2 className="text-lg" />
                        </button>
                      </div>
                    </span>
                  </section>
                </section>
              ))}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`py-0.5 rounded-lg text-white font-medium cursor-pointer ${
                        currentPage === index + 1
                          ? "bg-blue-800 px-2.5"
                          : "bg-blue-400 px-1.5"
                      } duration-200`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </section> */}
          </div>
        ) : (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        <div className="space-y-4 w-full max-w-lg mx-auto p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="admin">Admin</option>
              <option value="offices">Offices</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="w-full cursor-pointer sm:w-auto px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:border-red-700 hover:text-white hover:bg-red-700 duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateUser}
              className="w-full cursor-pointer sm:w-auto px-4 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800 duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add User"
      >
        <div className="space-y-4 w-full max-w-lg mx-auto p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                required
                type="text"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm({ ...addForm, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                required
                type={showAddPwdVisibility ? "text" : "password"}
                value={addForm.password}
                onChange={(e) =>
                  setAddForm({ ...addForm, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowAddPwdVisibility(!showAddPwdVisibility)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showAddPwdVisibility ? (
                  <LuEyeOff size={20} />
                ) : (
                  <LuEye size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              required
              value={addForm.role}
              onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="" disabled>
                Select...
              </option>
              <option value="admin">Admin</option>
              <option value="offices">Offices</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="w-full cursor-pointer sm:w-auto px-4 py-2 text-red-700 border border-red-700 hover:bg-red-700 hover:text-white rounded-lg duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="sumbit"
              onClick={() => {
                addForm.name == ""
                  ? toast.error("Enter Name")
                  : addForm.username == ""
                    ? toast.error("Enter Username")
                    : addForm.password == ""
                      ? toast.error("Enter Password")
                      : addForm.role == ""
                        ? toast.error("Select Role")
                        : handleCreateUser();
              }}
              className="w-full sm:w-auto px-5 py-2 border border-blue-700 text-white bg-blue-700 rounded-lg hover:border-blue-800 hover:bg-blue-800 transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        <div className="space-y-4 w-full max-w-sm mx-auto text-center p-5">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedUser?.name}</span>?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="w-full sm:w-auto px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default UsersManagement;
