import React, { useState } from "react";
import FormField from "@cloudscape-design/components/form-field";
import Button from "@cloudscape-design/components/button";
import Input from "@cloudscape-design/components/input";
import AWS from 'aws-sdk';
import TopNavigation from "@cloudscape-design/components/top-navigation";
import {useNavigate } from "react-router-dom";
// Initialize AWS SDK with environment variables
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION
});


const sns = new AWS.SNS()
const topicArn = process.env.REACT_APP_TOPIC_ARN;
function Uploadpage() {
  const [value, setValue] = useState([]);
  const [inputValue1, setInputValue1] = useState("");

  const navigate = useNavigate();
  const subcribe = async (topicArn, Email) => {
    const params = {
      Protocol: "email",
      TopicArn: topicArn,
      Endpoint: Email,
      ReturnSubscriptionArn: true || false,
    }

    sns.subscribe(params, (err, data) => {
      if (err) {
        console.error('Error subscribing to SNS topic:', err);
      } else {
        alert('Successfully subscribed to SNS topic:', data.SubscriptionArn)
        setInputValue1("")
        console.log('Successfully subscribed to SNS topic:', data.SubscriptionArn);
      }
    })

  }

  return (
    <>
      <TopNavigation
        identity={{
          href: "/",
          title: "Dashboard",
          ariaLabel: "Dashboard",
        }}
        utilities={[
          {
            type: "button",
            text: "Subscribe To SNS",
            onClick: () => {navigate("/subscribe")},
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <FormField
            label="Enter e-mail to subcribe to sns"
            description="Description"
          />
          <Input

            value={inputValue1}
            onChange={e =>
              setInputValue1(e.detail.value)
            }
            placeholder="e-mail"
          />
          <Button variant="primary" onClick={() => subcribe(topicArn, inputValue1)}>Subcribe</Button>
        </div>
      </div>
    </>
  );
}

export default Uploadpage;
