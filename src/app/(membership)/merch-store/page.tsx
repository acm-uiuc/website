'use client';
import React from 'react'
import { useEffect, useMemo, useState} from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem
} from '@nextui-org/react';
import axios from 'axios';
import Layout from '../MembershipLayout';

const [itemsList, setItemsList] = useState<any>([]); //TODO: type this

const baseUrl = process.env.REACT_APP_MERCH_API_BASE_URL ?? 'https://merchapi.acm.illinois.edu';
const baseOverridden = Boolean(process.env.REACT_APP_MERCH_API_BASE_URL);

const MerchStore = () => {
    const url = `${baseUrl}/api/v1/merch/all_item_details`;
    axios.get(url).then(response => {
        setItemsList(response.data);
      })

      if (itemsList.length === 0) {
        return <Layout name="Merch Store"></Layout>;
      } else {
        <Layout name="Merch Store">
            <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
            {itemsList.map((val: any) => ( // TODO: type this
                  <Card className="max-w-[512px] mx-4 my-auto shrink-0">
                    <CardHeader>
                        <p className="font-bold">
                            {val["item_name"]}
                        </p>
                    </CardHeader>
                    <CardBody>
                    {val["item_image"] ? (
                        <img alt={val["item_name"] + " image."} src={val["item_image"]} />
                    ) : null}
                    </CardBody>
                    <p>
                        <b>Cost:</b> ${val["item_price"]["paid"]} for paid ACM@UIUC members, ${val["item_price"]["others"]} for nonmembers.
                    </p>
                    <a href={"../merch/" + val["item_id"]}>
                        <Button
                            color="primary"
                            size="lg"
                        >
                            Purchase
                        </Button>
                    </a>
                  </Card>
                ))}
                
            </div>
        </Layout>
      }
    };

export default MerchStore;



}
