async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class DeleteTraveller extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.cancel;
    const serialNo = form.serialNo.value;
    if (serialNo === null || serialNo === undefined || serialNo === "") {
        alert("Please fill in the required info.");
    }
    else if (!(serialNo.match('^[0-9]*$')) || !(serialNo>=1 && serialNo<=25)) {
      alert("The serial no. is invalid. It should be a number between 1 and 25.");
    }
    else {
      const serialNo = form.serialNo.value;
      const isValid = this.props.deleteTraveller(serialNo);
      if(isValid) {
        form.serialNo.value = "";
      }
    }
  }
  render() {
    return (
      <div>
        <h2>Cancel a ticket</h2>
        <p>Input the serial no. to cancel your ticket. (The serial no. can be found at "Display Travellers" page.)</p>
        <form name="cancel" onSubmit={this.handleSubmit}>
          <div className="inputBlk">
              <label htmlFor="serialNo">Serial No.: </label>
              <input type="number" name="serialNo" placeholder="Serial No., from 1 to 25."/>
          </div>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}
class DisplayTravellerRow extends React.Component {
  render() {
    const traveller = this.props.traveller;
    return (
      <tr>
          <th scope="row" className="seatCol">{traveller.serialNo}</th>
          <td>{traveller.name}</td>
          <td>{traveller.phone}</td>
          <td>{traveller.created}</td>
      </tr>
    );
  }
}
class DisplayTraveller extends React.Component {
  render() {
    const travellerRows = this.props.travellers.map(traveller =>
      <DisplayTravellerRow key={traveller.serialNo} traveller={traveller} />
    );
    return (
      <div>
        <h2>Reservation List</h2>
        
        <table id="resListTbl">
            <thead>
                <tr>
                    <th scope="col">Serial No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Timestamp</th>
                </tr>
            </thead>
            <tbody>
              {travellerRows}
            </tbody>
        </table>
      </div>

    );
  }
}

function RemainingNum(props){
  return (
    <div id="remainingNumDiv">
      <label htmlFor="remainingNum">Free slots remaining:</label>
      <label id="remainingNum"></label>
      <label htmlFor="remainingNum"> {props.freeSlots} / 25</label>
    </div>
  );
}
class DisplayFreeSeats extends React.Component {
  render() {
    const slots = [];
    for (var i = this.props.freeSlots; i < 25; i++) {
      slots.push(<li className="redSlot"></li>);
    }
    for (var i = 0; i < this.props.freeSlots; i++) {
      slots.push(<li className="greySlot"></li>);
    }
    return (
      <div>
        <h2>Free seats</h2>
        <RemainingNum freeSlots={this.props.freeSlots}/>
        <div id="freeSeats">
          <ul id="availSlots">{slots} </ul>
        </div>
        <div className="center">
          <p>Grey: Empty</p>
          <p>Red: Occupied</p>
        </div>
      </div>
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
    else if (!(phone.match('^[0-9]{8}$'))) {
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
              <label htmlFor="name">Name: </label>
              <input type="text" name="name" placeholder="Your Name"/>
          </div>
          <div className="inputBlk">
              <label htmlFor="phone">Phone Number: </label>
              <input type="number" name="phone" placeholder="Only support SG number, like: 12345678"/>
          </div>
          <button id="bookBtn">Book</button>
        </form>
        <RemainingNum freeSlots={this.props.freeSlots}/> 

      </div>
    );
  }
}

class NavBar extends React.Component {
  render() {
    return (
      <div id="navbar">
        <button className="navBtn" onClick={() => this.props.display("welcome")}>Display Homepage</button>
        <button className="navBtn" onClick={() => this.props.display("addTraveller")}>Add Traveller</button>
        <button className="navBtn" onClick={() => this.props.display("deleteTraveller")}>Delete Traveller</button>
        <button className="navBtn" onClick={() => this.props.display("displayTraveller")}>Display Traveller</button>
        <button className="navBtn" onClick={() => this.props.display("displayFreeSeats")}>Display Free Seats</button>
        {/* <button id="clearBtn">Clear all data (for test)</button> */}
      </div>
    )
  }
}
class DisplayHomepage extends React.Component {
  render() {
    return (
      <div>
        <h2>Welcome!</h2>
        <RemainingNum freeSlots={this.props.freeSlots} /> 
      </div>
    );
  }
}
class Contents extends React.Component {
  constructor() {
    super();
    this.state = { page: "welcome", travellers: [], serial: 1};
    this.display = this.display.bind(this);
    this.addTraveller= this.addTraveller.bind(this);
    this.deleteTraveller= this.deleteTraveller.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  display(pageName){
    this.setState({page: pageName});
  }
  async loadData() {
    const query = `query {
      readTraveler {
        serialNo Name phone created
      }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ travellers: data.travellers });
    }
  }
  async addTraveller(traveller){
    const query = `mutation addTraveler($Traveler: TravelerInputs!) {
      addTraveler(Traveler: $Traveler) {
        serialNo
      }
    }`;

    const data = await graphQLFetch(query, { traveller });
    if (data) {
      alert(data);
      this.loadData();
    }
  }
  async deleteTraveller(serialNo) {
    const query = `mutation deleteTraveler($serialNo: Int!) {
      deleteTraveler(serialNo: $serialNo) {
        serialNo
      }
    }`;

    const data = await graphQLFetch(query, { traveller });
    if (data) {
      alert(data);
      this.loadData();
    }
  }

  render() {
    var page = this.state.page;
    let displayPage = null;
    if (page == "welcome") {
      displayPage = <DisplayHomepage freeSlots={25-this.state.travellers.length}/>;
    }
    else if (page == "addTraveller") {
      displayPage = <AddTraveller addTraveller={this.addTraveller} freeSlots={25-this.state.travellers.length}/>;
    }
    else if (page == "deleteTraveller") {displayPage = <DeleteTraveller deleteTraveller={this.deleteTraveller}/>;}
    else if (page == "displayTraveller") {displayPage = <DisplayTraveller travellers={this.state.travellers}/>;}
    else if (page == "displayFreeSeats") {displayPage = <DisplayFreeSeats freeSlots={25-this.state.travellers.length}/>;}
    
    return (
      <div className="contents">
        <NavBar display={this.display}/>
        <h1>Railway Ticket Reservation System</h1>
        <div id="page"> {displayPage} </div>
      </div>
    )
  }
}
const element = <Contents/>;

// displayHomepage, addTraveller, deleteTraveller, displayTraveller, displayFreeSeats
// page, tableRow
// navigationBar
ReactDOM.render(element, document.getElementById('contents'));
