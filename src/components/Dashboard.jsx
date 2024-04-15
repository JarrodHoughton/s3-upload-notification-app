import React, { useEffect, useState } from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import Table from "@cloudscape-design/components/table";
import { Link, useNavigate } from "react-router-dom";
import TextFilter from "@cloudscape-design/components/text-filter"; // Import TextFilter component
import Header from "@cloudscape-design/components/header"; // Import Header component
import Pagination from "@cloudscape-design/components/pagination"; // Import Pagination component
import Chart from "../components/Chart";
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION
});


const dynamodb = new AWS.DynamoDB();

export default Dashboard = () => {
  const [selectedItems, setSelectedItems] = React.useState([{ name: "Item 2" }]);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getItems().then(items => {
      setItems(items);
      console.log(items);
    });
  }, []);
  const getItems = async () => {
    const params = {
      TableName: 'logs',
    };

    try {
      const data = await dynamodb.scan(params).promise();
      const items = data.Items.map(item => AWS.DynamoDB.Converter.unmarshall(item));
      return items;
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  return (
    <div>
      {/* Top Navigation Component  */}
      <TopNavigation
        identity={
          {
            href: "/",
            title: "Dashboard",
            ariaLabel: "Dashboard",
          }
        }
        utilities={[
          {
            type: "button",
            text: "Subscribe To SNS",
            onClick: () => { navigate("/subscribe") },
          },
          {
            type: "button",
            text: "Upload To S3",
            onClick: () => { navigate("/upload") },
          },
          {
            type: "menu-dropdown",
            text: "Dummy User",
            description: "email@example.com",
            iconName: "user-profile",
            items: [
              { id: "signout", text: "Sign out" }
            ]
          },

        ]}
      />
      {/* Table Component */}

      <Chart data={items} />
      <Table
        onSelectionChange={({ detail }) =>
          setSelectedItems(detail.selectedItems)
        }
        selectedItems={selectedItems}
        ariaLabels={{
          selectionGroupLabel: "Items selection",
          allItemsSelectionLabel: ({ selectedItems }) =>
            `${selectedItems.length} ${selectedItems.length === 1 ? "item" : "items"
            } selected`,
          itemSelectionLabel: ({ selectedItems }, item) =>
            item.name
        }}
        columnDefinitions={[
          {
            id: "Id",
            header: "Id",
            cell: item => <Link href="#">{item.Id}</Link>,
            sortingField: "name",
            isRowHeader: true
          },
          {
            id: "Account",
            header: "AwsAccountId",
            cell: item => item.Account,
            sortingField: "alt"
          },
          {
            id: "Detail",
            header: "Details",
            cell: item => item.Detail
          },
          {
            id: "FileName",
            header: "FileName",
            cell: item => item.filename
          },
          {
            id: "FileSize",
            header: "FileSize",
            cell: item => item.filesize
          },
          {
            id: "Uploader",
            header: "Uploader",
            cell: item => item.Uploader
          },
          {
            id: "Timestamp",
            header: "Timestamp",
            cell: item => item.Timestamp
          }
        ]}
        columnDisplay={[
          { id: "Id", visible: true },
          { id: "Account", visible: true },
          { id: "Detail", visible: true },
          { id: "FileName", visible: true },
          { id: "FileSize", visible: true },
          { id: "Uploader", visible: true },
          { id: "Timestamp", visible: true },
        ]}
        enableKeyboardNavigation
        items={items}
        loadingText="Loading resources"
        selectionType="multi"
        trackBy="name"
        filter={
          <TextFilter filteringPlaceholder="Find resources" filteringText="" />
        }
        header={
          <Header
            counter={
              selectedItems.length ? "(" + selectedItems.length + "/10)" : "(10)"
            }
          >
            Table with common features
          </Header>
        }

        pagination={<Pagination currentPageIndex={1} pagesCount={2} />}
      />
    </div>
  );
};
