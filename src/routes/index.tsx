import { Routes, Route } from 'react-router-dom'
import { Signin } from '../pages/auth/signin';
import { Signup } from '../pages/auth/signup';
import Landing from '../pages/landing';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    )
}

export default Router;