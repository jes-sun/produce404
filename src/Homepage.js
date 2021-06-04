import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import logoFull from "./images/logo_full.png";
import idols from "./images/produce101.jpg";

function Homepage() {
    return (
        <>
        <div style={{
            backgroundImage: `url(${idols})`,
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
            }}/>
        <Container 
            className ="h-100"
            style={{
                backgroundColor: "white",
                boxShadow: "grey 0px 0px 10px",
                padding: "3em"
            }}
        >
            <Row>
                <Col className="d-flex flex-column align-items-center text-center">
                    <Image src={logoFull} height="200em" width="200em"/>
                    <h1 className="my-3">
                        Create your own K‑pop girl group.
                    </h1>
                    <h1 className="my-3">
                        Arrange your performance.
                    </h1>
                    <h1 className="my-3">
                        Get your first win.
                    </h1>
                    <h1 className="my-3">
                        Play today.
                    </h1>
                    <div className="my-3">
                        <Button variant="primary" className="mx-2">
                            Register
                        </Button>
                        <Button variant="secondary" className="mx-2">
                            Login
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default Homepage;