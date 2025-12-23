import express from 'express';
import { authCheck, userLogin, userSignup } from '../controllers/user.js';
import { secureRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/signup",userSignup);
userRouter.post("/login",userLogin);
userRouter.get("/check",secureRoute,authCheck);
// userRouter.get("/me", secureRoute, getUserProfile);

export default userRouter;