import { Row, Col, Div, Text, Icon } from "atomize";
import { useMemo } from "react";
import { Sig } from "../types/Sig";

type Props = {
  sigs: Array<Sig>;
};

function chunk<T>(arr: Array<T>, chunk_size: number): Array<Array<T>> {
  var i, j;
  const new_arr: Array<Array<T>> = [];
  for (i = 0, j = arr.length; i < j; i += chunk_size) {
    new_arr.push(arr.slice(i, i + chunk_size));
  }
  return new_arr;
}

function SigDisplay({ sig }: { sig: Sig }) {
  return (
    <Div style={{ paddingBottom: "1rem" }}>
      <Row>
        <Col
          size="4"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Div>
            <img
              src={sig.image}
              alt=""
              style={{ maxHeight: "100%", maxWidth: "100%" }}
            />
          </Div>
        </Col>
        <Col size="8">
          <Div p="0.25rem">
            <Div
              style={{
                display: "flex",
                flexDirection: "row",
                // justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text tag="h3" textSize="title" style={{ paddingRight: 10 }}>
                {sig.name}
              </Text>
              <Icon
                name="Github"
                color="black"
                size="40px"
                style={{ paddingRight: 10 }}
              >
                H
              </Icon>
            </Div>
            <Text>{sig.description}</Text>
          </Div>
        </Col>
      </Row>
    </Div>
  );
}

function SigList({ sigs }: Props) {
  const sigChunks = useMemo(() => chunk(sigs, 3), [sigs]);
  return (
    <>
      {sigChunks.map((sig_group) => {
        return (
          <Row>
            {sig_group.map((sig) => {
              return (
                <Col size="4">
                  <SigDisplay sig={sig} />
                </Col>
              );
            })}
          </Row>
        );
      })}
    </>
  );
}

export default SigList;
