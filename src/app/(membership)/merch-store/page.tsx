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

const MerchStore = () => {
  const [itemsList, setItemsList] = useState<Array<Record<string, any>>>([]);
  const baseUrl = process.env.NEXT_PUBLIC_MERCH_API_BASE_URL;
  const decimalHelper = (num: number) => {
    if (Number.isInteger(num)) {
      return num;
    } else {
      return num.toFixed(2);
    }
  }
  const metaLoader = async () => {
    const url = `${baseUrl}/api/v1/merch/all_item_details`;
    axios.get(url).then(response => {
      setItemsList(response.data);
    }).catch(error => {
      setItemsList([
        {
          "member_price": "",
          "nonmember_price": "",
          "item_image": "",
          "sizes": [],
          "item_price": { "paid": 999999, "others": 999999 }, "eventDetails": "",
          "item_id": "404_item",
          "total_sold": {},
          "total_avail": {},
          "limit_per_person": -1,
          "item_sales_active_utc": -1,
          "item_name": "",
        }
      ])
    });
  };
  useEffect(() => {
    metaLoader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (itemsList.length === 0) {
    return <Layout name="Merch Store"></Layout>;
  } else {
    return (<Layout name="Merch Store">
      <div>
        <div className='container'>
          <h1 className='text-center'>ACM @ UIUC Merch Store</h1>
          <div className="grid md:grid-cols-2 gap-2 items-stretch pt-5 auto-rows-max">
            {itemsList.map((val: Record<string, any>) => (
              <Card key={val["item_name"]} className="max-w-[512px] my-2 h-full container mt-auto flex">
                <CardHeader>
                  <p className="font-bold">
                    {val["item_name"]}
                  </p>
                </CardHeader>
                <CardBody className='justify-center'>
                  {val["item_image"] ? (
                    <img alt={val["item_name"] + " image."} src={val["item_image"]} />
                  ) : null}
                </CardBody>
                <p>
                  <b>Cost:</b> ${decimalHelper(val["item_price"]["paid"])} for paid ACM@UIUC members, ${decimalHelper(val["item_price"]["others"])} for non-members.
                </p>
                {
                  (val["limit_per_person"] && val["limit_per_person"] > 0) ? (
                    <i>
                      Limit {val["limit_per_person"]} per person.
                    </i>
                  ) : null
                }
                <br className='mb-4' />
                <Button
                  color="primary"
                  size="lg"
                  as={Link}
                  href={"../merch/" + val["item_id"]}
                >
                  Purchase
                </Button>
                <div className='py-2'></div>
              </Card>
            ))}
          </div>
        </div>
        <div className='mb-5'></div>
      </div>

    </Layout>)
  }
};
export default MerchStore;