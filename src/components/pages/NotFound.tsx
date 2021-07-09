import { PageContainer } from '../common';

const NotFoundPage = () => {
  return (
    <PageContainer>
      <div
        className="fade"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '50vh',
        }}
      >
        <div>
          <h2>The recourse you are looking for is not found.</h2>
        </div>
        <div>
          <h3>Sorry for the inconvenience</h3>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFoundPage;
