import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const withAuth = (Component) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/'); 
      }
    }, []);

    return <Component {...props} />;
  };
};

export default withAuth;
