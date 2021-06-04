import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import Fade from "react-bootstrap/Fade";
import React, { useState } from "react";

import logoFull from "./images/logo_full.png";
import idols from "./images/produce101.jpg";

function Homepage() {
    const [fadeIn0, setFadeIn0] = useState(false);
    const [fadeIn1, setFadeIn1] = useState(false);
    const [fadeIn2, setFadeIn2] = useState(false);
    const [fadeIn3, setFadeIn3] = useState(false);

    const setFadeIns = [setFadeIn0, setFadeIn1, setFadeIn2, setFadeIn3];
    React.useEffect(() => {
        setFadeIns.forEach((setFadeIn, i) => {
            setTimeout(() => {
                setFadeIn(true);
            }, 500*i)
        })
    }, []);

    return (
        <>
        <div style={{
            backgroundImage: `url(${idols})`,
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            position: "fixed",
            zIndex: -1,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
            }}/>
        <Container 
            className ="h-100 rounded"
            style={{
                backgroundColor: "white",
                boxShadow: "grey 0px 0px 10px",
                padding: "1em",
                marginBottom: "1em"
            }}
        >
            <Row>
                <Col className="d-flex flex-column align-items-center text-center">
                    <Image src={logoFull} height="200em" width="200em"/>
                    <Fade in={fadeIn0}>
                        <h1 className="my-3 display-1">
                            Create your own K‑pop girl group.
                        </h1>
                    </Fade>
                    <Fade in={fadeIn1}>
                        <h1 className="my-3 display-2">
                            Arrange your performance.
                        </h1>
                    </Fade>
                    <Fade in={fadeIn2}>
                        <h1 className="my-3 display-3">
                            Get your first win.
                        </h1>
                    </Fade>
                    <Fade in={fadeIn3}>
                        <h1 className="my-3 display-4">
                            Play today.
                        </h1>
                    </Fade>
                        <div className="my-3">
                            <Button variant="primary" size="lg" className="mx-2" href="/register">
                                Register
                            </Button>
                            <Button variant="secondary" size="lg" className="mx-2">
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