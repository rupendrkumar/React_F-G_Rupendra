import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

function Submissions() {
  const allEntries = JSON.parse(localStorage.getItem("allEntries"));
  const [displayDetail, setDisplay] = useState(false);
  const [singleEntry, setSingleEntry] = useState({
    name: "",
    email: "",
    phone: "",
    checkbox_values: [],
  });
  const [filterType, setFilterType] = useState("name");
  const [filterValue, setFilterValue] = useState("");
  const [filteredEntries, setFilteredEntries] = useState(allEntries || []);

  useEffect(() => {
    if (!window.location.pathname.includes("submissions")) {
      setDisplay(true);
      const id = window.location.pathname.split("/").pop();
      const entry = allEntries.filter(
        (item) => parseInt(item["id"]) === parseInt(id)
      )[0];
      setSingleEntry(entry);
    }
  }, [allEntries]);

  useEffect(() => {
    setFilteredEntries(
      allEntries.filter((entry) =>
        entry[filterType].toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }, [filterType, filterValue, allEntries]);

  const handleCheckVal = (ty, entry) => {
    let val = "";
    if (entry["checkbox_values"].length > 0) {
      val = entry["checkbox_values"]
        .filter((item) => item.split("_")[0] === ty)[0]
        .split("_")[1];
    }
    return val;
  };

  const singleEntryForm = () => {
    return (
      <Container>
        <Card>
          <Card.Header>
            <cite title="Source Title">Feedback Details</cite>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col>Customer Name</Col>
              <Col>{singleEntry["name"]}</Col>
            </Row>
            <Row>
              <Col>Email</Col>
              <Col>{singleEntry["email"]}</Col>
            </Row>
            <Row>
              <Col>Phone</Col>
              <Col>{singleEntry["phone"]}</Col>
            </Row>
            {Object.keys(feedback_type).map((ty) => (
              <Row key={ty}>
                <Col>{feedback_type[ty]}</Col>
                <Col>{handleCheckVal(ty, singleEntry)}</Col>
              </Row>
            ))}
          </Card.Body>
        </Card>
      </Container>
    );
  };

  const feedback_type = {
    qos: "Please rate the quality of the service you received from your host.",
    qob: "Please rate the quality of your beverage.",
    roc: "Was our restaurant clean?",
    exp: "Please rate your overall dining experience.",
  };

  return (
    <>
      {displayDetail ? (
        singleEntryForm()
      ) : (
        <div className="padding30px">
          <Form>
            <Form.Group controlId="filterType">
              <Form.Label>Filter by:</Form.Label>
              <Form.Control
                as="select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="name">Customer Name</option>
                <option value="phone">Phone Number</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="filterValue">
              <Form.Label>Enter value:</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter ${
                  filterType === "name" ? "name" : "phone number"
                }`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </Form.Group>
          </Form>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Form Details</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                {Object.keys(feedback_type).map((ty) => (
                  <th key={ty}>{feedback_type[ty]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <a
                      href={`/submission/${entry["id"]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </td>
                  <td>{entry["name"]}</td>
                  <td>{entry["email"]}</td>
                  <td>{entry["phone"]}</td>
                  {Object.keys(feedback_type).map((ty) => (
                    <td key={ty}>{handleCheckVal(ty, entry)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}

export default Submissions;
