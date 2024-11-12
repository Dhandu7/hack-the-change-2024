import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { jwtDecode } from "jwt-decode"; // Use named import for jwtDecode
import { useUser } from '../../context/UserContext';

const clientId = process.env.REACT_APP_CLIENT_ID;

const Login = () => {
    const { setUser } = useUser();  // Access the setUser function from context
    const navigate = useNavigate();

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                text="Login"
                onSuccess={(credentialResponse) => {
                    const decoded = jwtDecode(credentialResponse.credential);
                    console.log("LOGIN SUCCESS! Current User:", decoded);

                    // Set the user data in context
                    setUser({
                        name: decoded.name,
                        picture: decoded.picture,
                    });

                    navigate('/dashboard');
                }}
                onError={() => {
                    console.log("LOGIN FAILED!");
                }}
                useOneTap
                className="custom-login-button"
            />
        </GoogleOAuthProvider>
    );
}

export default Login;
