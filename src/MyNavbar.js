import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";

import logo from "./images/logo_horizontal.png";
// Search bar non functional

function MyNavbar() {
    return (
        <Navbar 
            sticky="top" 
            expand="md" 
            collapseOnSelect 
            className="mb-3 justify-content-around"
            style={{
                backgroundColor: "white",
                boxShadow: "grey 0px 0px 10px",
                paddingBottom: "0"
            }}>
            <Navbar.Brand href="/" style={{paddingTop: 0, paddingBottom: "0.75em"}}>
                <Image src={logo} alt="Kilobyte Cat Rescue" height="50em"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto align-items-center">
                    <Form>
                        <FormControl
                            type="text" 
                            placeholder="Search"
                            className="me-1"
                        />
                    </Form>
                    <Nav.Link className="mx-2">
                        Idol Roster
                    </Nav.Link>
                    <Nav.Link className="mx-2">
                        My Group
                    </Nav.Link>
                    <Nav.Link className="mx-2">
                        Leaderboard
                    </Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link className="mx-2">
                        My Account
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default MyNavbar;