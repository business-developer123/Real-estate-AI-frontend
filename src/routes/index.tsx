import { Routes, Route } from 'react-router-dom'
import { Signin } from '../pages/auth/signin';
import { Signup } from '../pages/auth/signup';

const Router = () => {
    return (
        <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    )
}

export default Router;