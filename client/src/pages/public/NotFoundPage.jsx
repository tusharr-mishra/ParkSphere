import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const NotFoundPage = () => {
  return (
    <PageShell
      title="404 - Page Not Found"
      subtitle="The requested route does not exist or has been relocated."
    >
      
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <a href="/" className="btn btn-primary">Return to Home</a>
      </div>
    </PageShell>
  );
};
