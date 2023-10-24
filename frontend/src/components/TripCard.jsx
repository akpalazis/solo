import React from "react";
import moment from "moment";

const Cart = (props) => {
  return (
    <div className="blog-card">
                  <div className="card-img"><img
                    src="https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"/>
                    <h1>{props.destination}</h1>
                  </div>
                  <div className="card-details">
                    <span><i className="fa fa-calendar"></i>{moment(props.startDate).format("DD/MM/yyyy")}</span>
                    <span><i className="fa fa-calendar"></i>-</span>
                    <span><i className="fa fa-calendar"></i>{moment(props.endDate).format("DD/MM/yyyy")}</span>
                  <div className="delete" onClick={() => props.deleteTrip(props.id)} >Delete</div>
                </div>
              </div>
  );
};

export default Cart;
