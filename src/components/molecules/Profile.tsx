
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
    const {currentUser, login, logout} = useAuth();

    return (
        <>
        <h1>Let's login already</h1>
        {currentUser ?
        <>
            <span>Hello {currentUser.email}!</span>
            <button onClick={() => logout()}>Logout</button>
        </> :
        <button onClick={() => login()}>Login with Google</button>
        }
        </>
    )
}

export default Profile;