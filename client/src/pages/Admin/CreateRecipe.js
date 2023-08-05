import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";

const CreateRecipe = () => {
  return (
    <Layout title={'Dashboard - Create Recipe'}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>Create Recipe</h1>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRecipe;
