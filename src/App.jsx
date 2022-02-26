class DeleteTraveller extends React.Component {
  render() {
    return (
      <div>
        <p>Click on a row to select a record, then confirm to cancel the ticket.</p>
        <div class="inputBlk">
            <label for="cancel">Cancel Ticket at Seat: </label>
            <input type="text" id="cancel"/>
        </div>

        <button id="cancelBtn">Confirm to cancel</button>
        <button id="backHomeBtn">Back to Homepage</button>
      </div>
    );
  }
}
class DisplayTravellerRow extends React.Component {
  render() {
    return (
        <p>traveller row place holder.</p>
    );
  }
}
class DisplayTraveller extends React.Component {
  render() {
    return (
      <div>
        <h2>Reservation List</h2>
        
        <table id="resListTbl">
            <thead>
                <tr>
                    <th scope="col">Seat</th>
                    <th scope="col">Serial No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Timestamp</th>
                </tr>
            </thead>
            <tbody>
              <DisplayTravellerRow/>
            </tbody>
        </table>
      </div>

    );
  }
}

class DisplayFreeSeats extends React.Component {
  render() {
    return (
      <ul id="availSlots"> </ul>
    );
  }
}
class AddTraveller extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.book;
    const name = form.name.value; const phone = form.phone.value;
    if (name === null || name === undefined || name === "" ||
        phone === null || phone === undefined || phone === "" ) {
        alert("Please fill in all the required info.");
    }
    else if (!(phone.match('[0-9]{8}'))) {
      alert("Your phone number is invalid. Only support SG number for test, like 12345678.");
    }
    else {
      const traveller = {
        name: form.name.value, phone: form.phone.value
      };
      const isValid = this.props.addTraveller(traveller);
      if(isValid) {
        form.name.value = ""; form.phone.value = "";
      }
    }
  }
  render() {
    return (
      <div>
        <h2>Add a traveller</h2>
        <form name="book" onSubmit={this.handleSubmit}>
          <p>Please input your name and phone number:</p>
          <div className="inputBlk">
              <label htmlFor="nameField">Name: </label>
              <input type="text" name="name" placeholder="Your Name"/>
          </div>
          <div className="inputBlk">
              <label htmlFor="phone">Phone Number: </label>
              <input type="number" name="phone" placeholder="Only support SG number, like: 12345678"/>
          </div>
          <button id="bookBtn">Book</button>
        </form>
        <div id="remainingNumDiv">
            <label htmlFor="remainingNum">Free slots:</label>
            <label id="remainingNum"></label>
            <label htmlFor="remainingNum"> {this.props.freeSlots} / 25</label>
        </div>
        <DisplayFreeSeats/>

      </div>
    );
  }
}

class NavBar extends React.Component {
  render() {
    return (
      <div id="navbar">
        <button onClick={() => this.props.display("welcome")}>Display Homepage</button>
        <button onClick={() => this.props.display("addTraveller")}>Add Traveller</button>
        <button onClick={() => this.props.display("deleteTraveller")}>Delete Traveller</button>
        <button onClick={() => this.props.display("displayTraveller")}>Display Traveller</button>
        <button onClick={() => this.props.display("displayFreeSeats")}>Display Free Seats</button>
        {/* <button id="clearBtn">Clear all data (for test)</button> */}
      </div>
    )
  }
}
class DisplayHomepage extends React.Component {
  render() {
    return <p>Welcome!</p>
  }
}
class Contents extends React.Component {
  constructor() {
    super();
    this.state = { page: "welcome", travellers: []};
    this.display = this.display.bind(this);
    this.addTraveller= this.addTraveller.bind(this);
  }
  display(pageName){
    this.setState({page: pageName});
  }
  addTraveller(traveller){
    if (this.state.travellers.length >= 26){
      alert("Reservation list is already full. You cannot book anymore.");
      return false;
    }
    else {
      traveller.serialNo = this.state.travellers.length + 1;
      traveller.created = Date.now();
      const newTravellers = this.state.travellers.slice();
      newTravellers.push(traveller);
      this.setState({travellers: newTravellers});
      return true;
    }
  }

  render() {
    var page = this.state.page;
    let displayPage = null;
    if (page == "welcome") {
      displayPage = <DisplayHomepage/>;
    }
    else if (page == "addTraveller") {
      displayPage = <AddTraveller addTraveller={this.addTraveller} freeSlots={25-this.state.travellers.length}/>;
    }
    else if (page == "deleteTraveller") {displayPage = <DeleteTraveller/>;}
    else if (page == "displayTraveller") {displayPage = <DisplayTraveller/>;}
    else if (page == "displayFreeSeats") {displayPage = <DisplayFreeSeats/>;}
    
    return (
      <div className="contents">
        <NavBar display={this.display}/>
        <h1>Railway Ticket Reservation System</h1>
        {displayPage}
      </div>
    )
  }
}
const element = <Contents/>;

// displayHomepage, addTraveller, deleteTraveller, displayTraveller, displayFreeSeats
// page, tableRow
// navigationBar
ReactDOM.render(element, document.getElementById('contents'));
