import moment from "moment";
import React, {useEffect, useState} from 'react';

const Cart = (props) => {
  const [imageUrl, setImageUrl] = useState(''); // Use state to store the image URL

  useEffect(() => {
    fetch(`api/getFlag/${props.destination}`) // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        const url = `/storage${data.Url}`
        setImageUrl(url);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []); // Use an empty dependency array to ensure the fetch runs only once
  return (
    <div className="blog-card">
      <div className="card-img">
        <img src={imageUrl} alt={props.destination} /> {/* Use src={imageUrl} */}
        <h1>{props.destination}</h1>
      </div>
      <div className="card-details">
        <span>
          <i className="fa fa-calendar"></i>
          {moment(props.startDate).format("DD/MM/yyyy")}
        </span>
        <span>
          <i className="fa fa-calendar"></i>-
        </span>
        <span>
          <i className="fa fa-calendar"></i>
          {moment(props.endDate).format("DD/MM/yyyy")}
        </span>
        <div className="delete" onClick={() => props.deleteTrip(props.id)}>
          Delete
        </div>
      </div>
    </div>
  );
};

export default Cart;
