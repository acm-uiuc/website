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
    const [itemsList, setItemsList] = useState<Array<Record<string, any>>>([]);

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
                    "sizes" : [],
                    "item_price": {"paid": 999999, "others": 999999}, "eventDetails": "",
                    "item_id": "404_item",
                    "total_sold": {},
                    "total_avail": {}, 
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
        
      
    };
export default MerchStore;