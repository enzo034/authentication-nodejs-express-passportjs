import {
    signup,
    signin,
    logout,
    dashboard,
    confirmEmail,
    requestConfirmationEmail,
    requestPasswordRecovery,
    resetPassword,
    renderResetPasswordPage,
    renderRequestPasswordRecovery,
    changeUserState2fa,
    verify2faCode,
    confirmationController,
    verify2fa,
    signinPost
}
    from '../controllers/Auth.controller.js';
import { Router } from 'express'
import passport from 'passport';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { validateDataSignup, validateDataSignin } from '../middlewares/validateData.js';
import { limiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.use(limiter);

router.get('/signup', signup);
router.get('/signin', signin);

router.get('/logout', logout);

router.get('/dashboard', isLoggedIn, dashboard);

router.post('/signup', validateDataSignup, passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
},));

router.post('/2fa', isLoggedIn, changeUserState2fa);

router.post('/signin', validateDataSignin, signinPost);

router.get('/verify-2fa', verify2fa);

router.post('/verify-2fa', verify2faCode)

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    (req, res, next) => {
        if (req.flash('2faRequired').length > 0) {
            return res.redirect('/verify-2fa');
        } else {
            return res.redirect('/dashboard');
        }
    }
);

router.get('/confirmemail/:token', confirmEmail);

router.post('/requestconfirmationemail', isLoggedIn, requestConfirmationEmail);

router.get('/confirmation', isLoggedIn, confirmationController);

router.get('/requestpasswordrecovery', renderRequestPasswordRecovery);
router.post('/requestpasswordrecovery', requestPasswordRecovery);

router.get('/resetpassword/:token', renderResetPasswordPage);
router.post('/resetpassword/:token', resetPassword);

export default router;