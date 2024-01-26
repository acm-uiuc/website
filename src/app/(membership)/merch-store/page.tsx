'use client';
import React, { useEffect } from 'react'
import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Link
} from '@nextui-org/react';
import axios from 'axios';
import Layout from '../MembershipLayout';



const baseUrl = process.env.REACT_APP_MERCH_API_BASE_URL ?? 'https://merchapi.acm.illinois.edu';
const baseOverridden = Boolean(process.env.REACT_APP_MERCH_API_BASE_URL);

const MerchStore = () => {
    const [itemsList, setItemsList] = useState<Record<string, any>>({});

    const metaLoader = async () => {
        const url = `${baseUrl}/api/v1/merch/all_item_details`;
        axios.get(url).then(response => {
            setItemsList(response.data);
          }).catch(error => {
            setItemsList({"data": [
                {
                    "member_price": "", 
                    "nonmember_price": "",
                    "item_image": "", 
                    "sizes" : [],
                    "item_price": {"paid": 999999, "others": 999999}, "eventDetails": "",
                    "item_id": "404_item",
                    "total_sold": {},
                    "total_avail": {}, 
                    "item_sales_active_utc": -1, 
                    "item_name": "", 
                  }
            ]})
        });
    };
    useEffect(() => {
        metaLoader();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
        
      if (itemsList.length === 0) {
        return <Layout name="Merch Store"></Layout>;
      } else {
        <Layout name="Merch Store">
            <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
            {itemsList["data"].map((val: Record<string, any>) => (
                  <Card key={val["item_name"]} className="max-w-[512px] mx-4 my-auto shrink-0">
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
                    <Button
                        color="primary"
                        size="lg"
                        as={Link}
                        href={"../merch/" + val["item_id"]}
                    >
                        Purchase
                    </Button>
                  </Card>
                ))}
                
            </div>
        </Layout>
      }
    };

export default MerchStore;