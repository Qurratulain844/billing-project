
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Settings() {

  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [company, setCompany] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    logo: null
  });

  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {

      const res = await API.get("company/");

      if (res.data) {
        setCompany(res.data);
        setLogoPreview(
          res.data.logo?.startsWith("http")
            ? res.data.logo
            : `http://127.0.0.1:8000${res.data.logo}`
        );
      }

    } catch (error) {
      console.log(error);
    }
  };

  // -------------------
  // ACCOUNT UPDATE
  // -------------------

  const updateAccount = async () => {

    try {

      await API.post("settings/", {
        username: username,
        old_password: oldPassword,
        new_password: newPassword
      });

      alert("Account updated successfully");

      setOldPassword("");
      setNewPassword("");

    } catch (error) {

      alert("Error updating account");

    }
  };

  // -------------------
  // COMPANY UPDATE
  // -------------------

  const updateCompany = async () => {

    try {

      const formData = new FormData();

      formData.append("name", company.name || "");
      formData.append("address", company.address || "");
      formData.append("city", company.city || "");
      formData.append("phone", company.phone || "");
      formData.append("email", company.email || "");

      if (company.logo && company.logo instanceof File) {
        formData.append("logo", company.logo);
      }

      await API.post("company/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Company settings saved");

    } catch (error) {

      console.log(error.response?.data);
      alert("Error saving company");

    }

  };

  return (

    <div className="p-8 max-w-4xl mx-auto space-y-8">

      <h1 className="text-2xl font-semibold">
        Settings
      </h1>

      {/* ACCOUNT SETTINGS */}

      <div className="bg-white p-6 rounded shadow space-y-4">

        <h2 className="text-lg font-semibold">
          Account Settings
        </h2>

        <input
          type="text"
          placeholder="New Username"
          className="w-full border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Old Password"
          className="w-full border p-2 rounded"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={updateAccount}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Account
        </button>

      </div>

      {/* COMPANY SETTINGS */}

      <div className="bg-white p-6 rounded shadow space-y-4">

        <h2 className="text-lg font-semibold">
          Company Settings
        </h2>

        {logoPreview && (
          <img
            src={logoPreview}
            alt="logo"
            className="h-20 mb-3"
          />
        )}

        <input
          type="file"
          onChange={(e) => {
            setCompany({ ...company, logo: e.target.files[0] });
            setLogoPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        <input
          type="text"
          placeholder="Company Name"
          className="w-full border p-2 rounded"
          value={company.name}
          onChange={(e) =>
            setCompany({ ...company, name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Address"
          className="w-full border p-2 rounded"
          value={company.address}
          onChange={(e) =>
            setCompany({ ...company, address: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="City"
          className="w-full border p-2 rounded"
          value={company.city}
          onChange={(e) =>
            setCompany({ ...company, city: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Phone"
          className="w-full border p-2 rounded"
          value={company.phone}
          onChange={(e) =>
            setCompany({ ...company, phone: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={company.email}
          onChange={(e) =>
            setCompany({ ...company, email: e.target.value })
          }
        />

        <button
          onClick={updateCompany}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Company Settings
        </button>

      </div>

    </div>
  );

}


