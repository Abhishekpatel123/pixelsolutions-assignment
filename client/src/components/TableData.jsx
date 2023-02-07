import React, { useEffect, useState } from "react";
import axios from "axios";

const findUser = (data, value) => {
  const find = data.find(({ location }) => {
    const city = location.city.toUpperCase();
    const state = location.state.toUpperCase();
    const country = location.country.toUpperCase();
    const postcode = location.postcode.toString().toUpperCase();
    const number = location.street.number.toString().toUpperCase();
    const name = location.street.name.toUpperCase();
    const latitude = location.coordinates.latitude.toString().toUpperCase();
    const longitude = location.coordinates.longitude.toString().toUpperCase();

    if (
      city === value ||
      state === value ||
      country === value ||
      postcode === value ||
      number === value ||
      name === value ||
      latitude === value ||
      longitude === value
    ) {
      return true;
    }
  });
  return find;
};

const sortData = (data, name) => {
  const sortedData = data?.sort((a, b) => {
    let A;
    let B;

    // for street name
    if (name === "name" || name === "number") {
      A = a.location.street[name].toString().toUpperCase();
      B = b.location.street[name].toString().toUpperCase();
    }

    // latitude
    else if (name === "latitude" || name === "longitude") {
      A = a.location.coordinates[name];
      B = b.location.coordinates[name];
    }
    // default
    else {
      A = a.location[name].toUpperCase();
      B = b.location[name].toUpperCase();
    }
    return A > B ? 1 : A < B ? -1 : 0;
  });
  return sortedData;
};

const TableData = () => {
  let delayDebounceFn;
  const [data, setData] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [searching, setSearching] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://randomuser.me/api?results=30");
      setData(response.data.results);
      setFilterData(response.data.results);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!data) fetchUsers();
  }, [data]);

  const handleSearch = (e) => {
    const value = e.target.value.trim().toUpperCase();

    if (!value) setSearching(false);
    else setSearching("Searching...");

    clearInterval(delayDebounceFn);
    delayDebounceFn = setTimeout(() => {
      const find = findUser(data, value);
      if (find) {
        setFilterData([find]);
        setSearching(null);
      } else {
        setFilterData(data);
        setSearching("No Record found.");
      }
    }, 3000);
  };

  const handleSort = (name) => {
    if (name === "postcode") alert("Sort functionality not implemented");
    const sortedData = sortData(data, name);
    setFilterData([...sortedData]);
  };

  return (
    <div>
      <h2>Random User List</h2>
      <input type="text" name="search" onChange={handleSearch} />
      <div>{searching}</div>
      <table>
        <tr>
          <th onClick={() => handleSort("city")}>City</th>
          <th onClick={() => handleSort("state")}>State</th>
          <th onClick={() => handleSort("country")}>Country</th>
          <th onClick={() => handleSort("postcode")}>Post Code</th>
          <th onClick={() => handleSort("number")}>Number</th>
          <th onClick={() => handleSort("name")}>Name</th>
          <th onClick={() => handleSort("latitude")}>Latitude</th>
          <th onClick={() => handleSort("longitude")}>Longitude</th>
          <th>Profile</th>
        </tr>
        {!data && <h2>Loading</h2>}
        {filterData?.map(({ location, picture }, idx) => (
          <tr key={idx}>
            <td>{location?.city}</td>
            <td>{location?.state}</td>
            <td>{location?.country}</td>
            <td>{location?.postcode}</td>
            <td>{location?.street?.number}</td>
            <td>{location?.street?.name}</td>
            <td>{location?.coordinates?.latitude}</td>
            <td>{location?.coordinates?.longitude}</td>
            <td>
              <img alt="profile" src={picture.medium} />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default TableData;
