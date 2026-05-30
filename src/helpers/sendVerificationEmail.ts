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

        const response = await resend.emails.send({
            from: "onboarding@resend.dev",
            // to: email,
            to: "jessbhardwaj@gmail.com",
            subject: 'message | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        console.log("Resend response:", response);
        return { success: true, message: "successfully sent verification email" }

    } catch (emailError) {
        console.error("Error verification email", emailError);
        return { success: false, message: "failed to send verification email" }
    }
}

