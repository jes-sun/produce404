import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import logoFull from "./images/logo_full.png";

import { Formik } from "formik";
import * as Yup from "yup";

function Register() {
    const validationSchema = Yup.object().shape({
        name: Yup.string()
        .required("*Must enter a name")
        .max(20, "*Name must not be longer than 20 characters"),
        username: Yup.string()
        .required("*Must enter a username")
        .min(4, "*Username must be at least 4 characters")
        .max(20, "*Username must not be longer than 20 characters"),
        password: Yup.string()
        .required("*Must enter a password")
        .min(4, "*Password must be at least 4 characters")
        .max(20, "*Password must not be longer than 20 characters"),
        groupName: Yup.string()
        .required("*Must enter a group name")
        .max(20, "*Group name must not be longer than 20 characters"),
    })

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
            <Formik
                initialValues={{
                    name: "",
                    username: "",
                    password: "",
                    groupName: ""
                }}
                validationSchema={validationSchema}
                onSubmit={(values, {setSubmitting}) => {
                    setSubmitting(true);

                    console.log(values);
                    // fetch("localhost:8080/api/register",
                    //     {method:"POST", headers: {
                    //         'Accept': 'application/json',
                    //         'Content-Type': 'application/json'
                    //     },body: JSON.stringify(user)})
                    // .then(response => response.json())
                    // .then(data => {
                    //     //
                    // }
                }}
            >
                {( {values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting
                }) => (
                <Form onSubmit={handleSubmit}>
                    <Row className="justify-content-around">
                        <Col md={12} lg={5}>
                            <Form.Group className="mb-3" controlID="formName">
                                <Form.Label>
                                    Name
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    isValid={touched.name && !errors.name}
                                    isInvalid={touched.name && errors.name}
                                />           
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlID="formUsername">
                                <Form.Label>
                                    Username
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    placeholder="Enter a unique username"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.username}
                                    isValid={touched.username && !errors.username}
                                    isInvalid={touched.username && errors.username}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.username}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlID="formPassword">
                                <Form.Label>
                                    Password
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    isValid={touched.password && !errors.password}
                                    isInvalid={touched.password && errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <hr/>
                            <Form.Group className="mb-3" controlID="formGroupName">
                                <Form.Label>
                                    Group Name
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="groupName"
                                    placeholder="Enter a name for your K-pop group"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.groupName}
                                    isValid={touched.groupName && !errors.groupName}
                                    isInvalid={touched.groupName && errors.groupName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.groupName}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Row>
                                <Col className="d-flex justify-content-end">
                                    <Button className="mx-1" variant="primary" type="submit" disabled={isSubmitting}>
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
                )}
            </Formik>
        </Container>
    )
};

export default Register;