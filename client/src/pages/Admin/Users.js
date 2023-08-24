import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from your backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/api/v1/user/get-all-users`)
      .then((response) => {
        setUsers(response?.data?.users); // assuming users are returned in an array with key "users"
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const makeAdmin = (userId) => {
    axios
      .put(`${process.env.REACT_APP_API}/api/v1/user/make-admin/${userId}`)
      .then((response) => {
        // Either refresh the user list or update the state directly.
        // Here, I'm opting to refresh the user list.
        return axios.get(
          `${process.env.REACT_APP_API}/api/v1/user/get-all-users`
        );
      })
      .then((response) => {
        setUsers(response?.data?.users);
      })
      .catch((error) => {
        console.error("Error making user an admin:", error);
      });
  };

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>All users</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user?._id}>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.role === 1 ? "Yes" : "No"} </td>
                  <td>
                    {!user?.isAdmin && (
                      <button onClick={() => makeAdmin(user._id)}>
                        Make Admin
                      </button>
                    )}
                    {/* Additional actions like banning can be added here later */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
