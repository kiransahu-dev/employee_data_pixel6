import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Emp.css";
import {
  TbArrowsSort,
  TbPlayerTrackNext,
  TbPlayerTrackPrev,
} from "react-icons/tb";

const EmployeeDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState({ sortedPart: "", order: "" });
  const [filters, setFilters] = useState({ gender: "" });
  const [page, setPage] = useState(1);
  const [allPage, setAllPage] = useState(1);

  // fetch data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await axios.get("https://dummyjson.com/users", {
        params: {
          limit: 10,
          skip: (page - 1) * 10,
        },
      });
      console.log(data);
      //   setUsers((prevUsers) => [...prevUsers, ...data?.data.users]);
      setUsers(data?.data.users);
      setAllPage(Math.ceil(data?.data?.total / 10));
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > allPage) return;
    setPage(newPage);
  };

  // sort and toggle the data in ascending or descending order
  const handleSort = (sortedPart) => {
    const order =
      sort.sortedPart === sortedPart && sort.order === "asc" ? "desc" : "asc";
    setSort({ sortedPart, order });
    setUsers([]); // reset users
    setPage(1); // reset page
  };

  //   filter the data
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setUsers([]); // reset users
    setPage(1); // reset page
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sort.sortedPart) return 0;
    if (sort.order === "asc") {
      return a[sort.sortedPart] > b[sort.sortedPart] ? 1 : -1;
    } else {
      return a[sort.sortedPart] < b[sort.sortedPart] ? 1 : -1;
    }
  });

  const filteredUsers = sortedUsers.filter((user) => {
    return (
      (!filters.gender || user.gender === filters.gender) &&
      (!filters.country || user.address.country === filters.country)
    );
  });

  // side effect for user
  useEffect(() => {
    fetchUsers();
  }, [page, sort, filters]);

  return (
    <>
      <div>
        {/* heading */}
        <h1>Employee Details</h1>
        {/* filter section according to gender */}
        <div className="labl">
          <label>
            Gender:{" "}
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>
        <table>
          {/* table heading */}
          <thead>
            <tr>
              <th>Sl no.</th>
              <th>
                ID{" "}
                <TbArrowsSort
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleSort("id")}
                />{" "}
              </th>
              <th>Image</th>
              <th>
                Name{" "}
                <TbArrowsSort
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleSort("name")}
                />{" "}
              </th>
              <th>
                Age{" "}
                <TbArrowsSort
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleSort("age")}
                />{" "}
              </th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Country</th>
            </tr>
          </thead>
          {/* table data */}
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user?.id}</td>
                <td className="image">
                  <img src={user?.image} alt="image/logo" />
                </td>
                <td>
                  {user?.firstName} {user?.lastName}
                </td>
                <td>{user?.age}</td>
                <td>{user?.gender}</td>
                <td>{user?.phone}</td>
                <td>{user?.email}</td>
                <td>{user?.company?.title}</td>
                <td>{user?.role}</td>
                <td>{user?.address.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p>Loading...</p>}
        <div className="pagination">
          <TbPlayerTrackPrev
            onClick={() => handlePageChange(page - 1)}
            style={{
              color: page === 1 ? "gray" : "cyan",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
            disabled={page === 1}
          />
          <p>
            {page} page of {allPage}
          </p>
          <TbPlayerTrackNext
            onClick={() => handlePageChange(page + 1)}
            style={{
              color: page === allPage ? "gray" : "cyan",
              cursor: page === allPage ? "not-allowed" : "pointer",
            }}
            disabled={page === allPage}
          />
        </div>
      </div>
    </>
  );
};

export default EmployeeDetails;
