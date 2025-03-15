import React from 'react';
import { Result } from 'antd';
import { FrownOutlined, ReloadOutlined } from '@ant-design/icons';
import { FwButton } from "@freshworks/crayons/react";


function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Result
      status="error"
      icon={<FrownOutlined style={{ color: '#b9bcc0' }} />} 
      title="Sorry! Something went wrong."
      subTitle={error?.message || "An unexpected error has occurred."}
      extra={[
        <FwButton 
          color="primary" 
          onClick={resetErrorBoundary}
          key="reload"
        >
        <ReloadOutlined  style={{marginRight:10}} />  Reload
        </FwButton>
      ]}
    />
  );
}

export default ErrorFallback;
