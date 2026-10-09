'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import OpenDevSocietyBranding from '@/components/OpenDevSocietyBranding';
import { requestPasswordResetEmail } from '@/lib/actions/auth.actions';

type ForgotPasswordFormData = {
    email: string;
};

const ForgotPasswordPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        defaultValues: {
            email: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            const result = await requestPasswordResetEmail(data);

            if (result.success) {
                toast.success('אם קיים חשבון עם האימייל הזה, נשלח אליו קישור לאיפוס.');
                return;
            }

            toast.error('איפוס הסיסמה לא זמין', {
                description: result.error ?? 'לא ניתן להתחיל איפוס סיסמה.',
            });
        } catch (error) {
            toast.error('איפוס הסיסמה לא זמין', {
                description: error instanceof Error ? error.message : 'לא ניתן להתחיל איפוס סיסמה.',
            });
        }
    };

    return (
        <>
            <h1 className="form-title">שכחתם סיסמה?</h1>
            <p className="text-sm text-gray-400 mb-6">
                הזינו את כתובת האימייל ונשלח לכם קישור לאיפוס הסיסמה.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="אימייל"
                    placeholder="opendevsociety@cc.cc"
                    register={register}
                    error={errors.email}
                    validation={{
                        required: 'חובה להזין אימייל',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                            message: 'כתובת אימייל לא תקינה',
                        },
                    }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Sending reset link' : 'Send reset link'}
                </Button>

                <FooterLink text="Remembered it?" linkText="Sign in" href="/sign-in" />
                <OpenDevSocietyBranding outerClassName="mt-10 flex justify-center" />
            </form>
        </>
    );
};

export default ForgotPasswordPage;
