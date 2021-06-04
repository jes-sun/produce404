import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import logoFull from "./images/logo_full.png";

function Register() {
    return(
        <Container>
            <Row>
                <Col>
                    <h1 className="display-1">
                        Create an account
                    </h1>
                    <h5 className="lead ms-1">
                        Found your own entertainment company and recruit your favourite idols to create the ultimate K-pop powerhouse.
                    </h5>
                    <hr/>
                </Col>
            </Row>
            <Form>
                <Row className="justify-content-around">
                    <Col md={12} lg={5}>
                        <Form.Group className="mb-3" controlID="formName">
                            <Form.Label>
                                Name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                            />
                            <Form.Text className="text-muted ms-1">
                                What should we call you?
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlID="formUsername">
                            <Form.Label>
                                Username
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter a unique username"
                            />
                            <Form.Text className="text-muted ms-1">
                                You'll use this to log in.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlID="formPassword">
                            <Form.Label>
                                Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                            />
                            <Form.Text className="text-muted ms-1">
                                Choose carefully.
                            </Form.Text>
                        </Form.Group>
                        <hr/>
                        <Form.Group className="mb-3" controlID="formGroupName">
                            <Form.Label>
                                Group Name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter a name for your K-pop group"
                            />
                            <Form.Text className="text-muted ms-1">
                                You can change this later.
                            </Form.Text>
                        </Form.Group>
                        <Row>
                            <Col className="d-flex justify-content-around">
                                <Button className="mx-1" variant="secondary">
                                    Check username availability
                                </Button>
                                <Button className="mx-1" variant="primary">
                                    Register
                                </Button>
                            </Col>
                        </Row>
                        
                    </Col>
                    <Col className="d-sm-none d-lg-flex" sm={1} md={5}>
                        <Image src={logoFull} height="400em"/>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
};

export default Register;