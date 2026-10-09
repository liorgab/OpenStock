'use client';

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import ChoiceChips from "@/components/forms/ChoiceChips";
import PasswordRequirements from "@/components/forms/PasswordRequirements";
import { INVESTMENT_GOALS, PASSWORD_VALIDATION, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OpenDevSocietyBranding from "@/components/OpenDevSocietyBranding";
import SocialAuthButtons from "@/components/forms/SocialAuthButtons";
import React from "react";

const SignUp = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'IN',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology'
        },
        mode: 'onBlur'
    },);

    const passwordValue = watch('password');

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if (result.success) {
                router.push('/dashboard');
                return;
            }
            toast.error('ההרשמה נכשלה', {
                description: result.error ?? 'לא הצלחנו ליצור את החשבון.',
            });
        } catch (e) {
            console.error(e);
            toast.error('ההרשמה נכשלה', {
                description: e instanceof Error ? e.message : 'יצירת החשבון נכשלה.'
            })
        }
    }

    return (
        <>
            <h1 className="form-title mb-2">יצירת חשבון</h1>
            <p className="mb-8 text-faint">חינם ובקוד פתוח. בלי כרטיס אשראי.</p>

            <SocialAuthButtons />

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <section className="flex flex-col gap-4" aria-label="חשבון">
                    <InputField
                        name="fullName"
                        label="שם מלא"
                        placeholder="השם שלכם"
                        register={register}
                        error={errors.fullName}
                        validation={{ required: 'חובה להזין שם מלא', minLength: 2 }}
                    />
                    <InputField
                        name="email"
                        label="אימייל"
                        placeholder="you@example.com"
                        register={register}
                        error={errors.email}
                        validation={{
                            required: 'חובה להזין אימייל',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                                message: 'כתובת אימייל לא תקינה'
                            }
                        }}
                    />
                    <div className="flex flex-col gap-2">
                        <InputField
                            name="password"
                            label="סיסמה"
                            placeholder="לפחות 8 תווים"
                            type="password"
                            register={register}
                            error={errors.password}
                            validation={PASSWORD_VALIDATION}
                        />
                        <PasswordRequirements password={passwordValue ?? ''} />
                    </div>
                </section>

                <section className="flex flex-col gap-5 border-t border-line pt-6" aria-labelledby="personalize">
                    <div>
                        <p id="personalize" className="kicker text-brand-ink">התאמה אישית</p>
                        <p className="mt-1 text-[13px] text-faint">משמש להתאמת מייל הפתיחה שלכם.</p>
                    </div>
                    <CountrySelectField
                        name="country"
                        label="מדינה"
                        control={control}
                        error={errors.country}
                        required
                    />
                    <ChoiceChips name="investmentGoals" label="מטרת השקעה" options={INVESTMENT_GOALS} control={control} />
                    <ChoiceChips name="riskTolerance" label="סיבולת סיכון" options={RISK_TOLERANCE_OPTIONS} control={control} />
                    <ChoiceChips name="preferredIndustry" label="תחום מועדף" options={PREFERRED_INDUSTRIES} control={control} />
                </section>

                <div className="flex flex-col gap-4">
                    <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full">
                        {isSubmitting ? 'יוצר חשבון…' : 'יצירת חשבון'}
                    </Button>
                    <FooterLink text="כבר יש לכם חשבון?" linkText="התחברו" href="/sign-in" />
                </div>

                <OpenDevSocietyBranding outerClassName="flex justify-center" />
            </form>
        </>
    )
}
export default SignUp;
