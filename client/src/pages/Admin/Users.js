import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";

const Users = () => {
  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="row">
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9">
          <h1>All users</h1>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
