import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { error } from "console";
export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'message | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: false, message: "successfully sent verification email" }

    } catch (emailError) {
        console.error("Error verification email", emailError);
        return { success: false, message: "failed to send verification email" }
    }
}

