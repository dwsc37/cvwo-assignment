import { RingLoader } from 'react-spinners';

const LoadingPage = () => {
  return (
    <div className="loading-spinner-container">
      <RingLoader size={150} color={'#36D7B7'} />
    </div>
  );
};

export default LoadingPage;