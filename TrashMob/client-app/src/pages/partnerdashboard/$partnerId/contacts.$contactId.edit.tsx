import { useCallback, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInput from 'react-phone-input-2';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { EnhancedFormLabel as FormLabel } from '@/components/ui/custom/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import * as ToolTips from '@/store/ToolTips';
import { GetPartnerContactsByContactId, GetPartnerContactsByPartnerId, UpdatePartnerContact } from '@/services/contact';
import PartnerContactData from '@/components/Models/PartnerContactData';
import * as Constants from '@/components/Models/Constants';

interface FormInputs {
    name: string;
    email: string;
    phone: string;
    notes: string;
    lastUpdatedDate: string;
}

const formSchema = z.object({
    name: z.string({ required_error: 'Name cannot be blank.' }),
    email: z.string().email(),
    phone: z.string().regex(Constants.RegexPhoneNumber, { message: 'Please enter a valid phone number.' }),
    notes: z
        .string({ required_error: 'Notes cannot be empty.' })
        .min(1, 'Notes cannot be empty.')
        .max(1000, 'Notes cannot be more than 1000 characters long'),
});

const useGetPartnerContactById = (contactId: string) =>
    useQuery({
        queryKey: GetPartnerContactsByContactId({ contactId }).key,
        queryFn: GetPartnerContactsByContactId({ contactId }).service,
        select: (res) => res.data,
    });

export const PartnerContactEdit = () => {
    const { partnerId, contactId } = useParams<{ partnerId: string; contactId: string }>() as {
        partnerId: string;
        contactId: string;
    };
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: currentValues, isLoading } = useGetPartnerContactById(contactId);

    const { mutate, isLoading: isSubmitting } = useMutation({
        mutationKey: UpdatePartnerContact().key,
        mutationFn: UpdatePartnerContact().service,
        onSuccess: () => {
            toast({
                variant: 'primary',
                title: 'Contact saved!',
                description: '',
            });
            queryClient.invalidateQueries({
                queryKey: GetPartnerContactsByPartnerId({ partnerId }).key,
                refetchType: 'all',
            });
            navigate(`/partnerdashboard/${partnerId}/contacts`);
        },
    });

    const form = useForm<FormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: currentValues?.name,
            phone: currentValues?.phone,
            email: currentValues?.email,
            createdDate: `${currentValues?.createdDate}`,
            lastUpdatedDate: `${currentValues?.lastUpdatedDate}`,
        },
    });

    useEffect(() => {
        if (currentValues) {
            form.reset({
                ...currentValues,
                createdDate: `${currentValues?.createdDate}`,
                lastUpdatedDate: `${currentValues?.lastUpdatedDate}`,
            });
        }
    }, [currentValues]);

    const onSubmit: SubmitHandler<FormInputs> = useCallback(
        (formValues) => {
            if (!currentValues) return;

            const body = new PartnerContactData();
            body.id = contactId;
            body.partnerId = partnerId;
            body.name = formValues.name ?? '';
            body.email = formValues.email ?? '';
            body.phone = formValues.phone ?? '';
            body.notes = formValues.notes ?? '';
            body.createdByUserId = currentValues.createdByUserId;
            mutate(body);
        },
        [currentValues, partnerId],
    );

    if (isLoading) {
        return <Loader2 className='animate-spin m-10' />;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-12 gap-4'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem className='col-span-6'>
                            <FormLabel tooltip={ToolTips.PartnerContactName} required>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem className='col-span-6'>
                            <FormLabel tooltip={ToolTips.PartnerContactEmail} required>
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                        <FormItem className='col-span-6'>
                            <FormLabel tooltip={ToolTips.PartnerContactPhone} required>
                                Phone
                            </FormLabel>
                            <FormControl>
                                <PhoneInput country='us' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='lastUpdatedDate'
                    render={({ field }) => (
                        <FormItem className='col-span-6'>
                            <FormLabel tooltip={ToolTips.PartnerLastUpdatedDate}>Last Update Date</FormLabel>
                            <FormControl>
                                <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='notes'
                    render={({ field }) => (
                        <FormItem className='col-span-12'>
                            <FormLabel tooltip={ToolTips.PartnerContactNotes} required>
                                Notes
                            </FormLabel>
                            <FormControl>
                                <Textarea {...field} maxLength={1000} className='h-24' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='col-span-12 flex justify-end gap-2'>
                    <Button variant='secondary' data-test='cancel' asChild>
                        <Link to={`/partnerdashboard/${partnerId}/contacts`}>Cancel</Link>
                    </Button>
                    <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className='animate-spin' /> : null}
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};