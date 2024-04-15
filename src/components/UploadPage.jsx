import React, { useState } from "react";
import FileUpload from "@cloudscape-design/components/file-upload";
import FormField from "@cloudscape-design/components/form-field";
import Button from "@cloudscape-design/components/button";
import AWS from 'aws-sdk';
import TopNavigation from "@cloudscape-design/components/top-navigation";
import {useNavigate } from "react-router-dom";
// Initialize AWS SDK with environment variables
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION
});


const s3 = new AWS.S3();
function Uploadpage() {
  const [value, setValue] = useState([]);

  const navigate = useNavigate();
  const handleFileUpload = async (files) => {
    try {
      for (const file of files) {
        const params = {
          Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
          Key: file.name,
          Body: file,
        };

        await s3.upload(params).promise();
      }
      alert('Successfully uploaded files');

    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleButtonClick = () => {
    // Trigger file upload when the button is clicked
    handleFileUpload(value);
  };

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
            label="upload object"
            description="Description"
          >
            <FileUpload
              onChange={({ detail }) => {
                setValue(detail.value);
              }}
              value={value}
              ariaRequired
              i18nStrings={{
                uploadButtonText: e =>
                  e ? "Choose files" : "Choose file",
                dropzoneText: e =>
                  e
                    ? "Drop files to upload"
                    : "Drop file to upload",
                removeFileAriaLabel: e =>
                  `Remove file ${e + 1}`,
                limitShowFewer: "Show fewer files",
                limitShowMore: "Show more files",
                errorIconAriaLabel: "Error"
              }}
              invalid
              multiple
              showFileLastModified
              showFileSize
              showFileThumbnail
              tokenLimit={3}
              constraintText="Hint text for file requirements"
            />
          </FormField>
          <Button variant="primary" onClick={handleButtonClick}>Upload</Button>
        </div>
      </div>
    </>
  );
}

export default Uploadpage;
