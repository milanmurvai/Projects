"use client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "./ui/select";
import {Type, User} from "@/utils/types.tsx";
import {AuthService} from "@/apis/auth/AuthService.tsx";
import {toast} from "@/components/ui/use-toast.ts";
import {capitalizeString} from "@/lib/utils.ts";
import "../pages/auth/Login.css";


const FormSchema = z.object({
    username: z.string().min(3).max(64),
    password: z.string().min(3).max(64),
    name: z.string().min(3).max(64),
    type: z.nativeEnum(Type),
}).required();

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.type === "string") {
            return {message: capitalizeString(issue.path.toString()) + " is too short!"};
        }
    }

    return {message: ctx.defaultError};
};

z.setErrorMap(customErrorMap);


// The sign-up form
// Contains username, email, password, name, gender fields
// Throws a toast message to parent if any data is invalid
export function SignUpForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
            name: "",
            type: Type.ANGAJAT,
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const {status, message} = await AuthService.signup(data as User);

        toast({
            title: status === 200 ? "Success" : "Error",
            variant: status === 200 ? "default" : "destructive",
            description:
            message,
        })
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="widescreensdiv">
                        <div className=" widescreenmarginr w-full space-y-4">
                            {/*  USERNAME  */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-white tracking-wider">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=""
                                                {...field}
                                                className="border-[#C51321] rounded-full border-[1px] "
                                            />
                                        </FormControl>

                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/*  NAME  */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-white tracking-wider">
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=""
                                                {...field}
                                                className="border-[#C51321] rounded-full border-[1px]"
                                            />
                                        </FormControl>

                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="widescreenmarginl  w-full space-y-4">
                            {/*  PASSWORD  */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-white tracking-wider">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=""
                                                {...field}
                                                className="border-[#C51321] rounded-full border-[1px]"
                                                type="password"
                                            />
                                        </FormControl>

                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />


                            {/*  TYPE  */}
                            <FormField
                                control={form.control}
                                name="type"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-white tracking-wider">
                                            Type
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="border-[#C51321] rounded-full border-[1px]">
                                                    <SelectValue placeholder="Choose"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={Type.ANGAJAT}>Angajat</SelectItem>
                                                    <SelectItem value={Type.ADMIN}>Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/*  SUBMIT BUTTON  */}
                    <Button
                        className="bg-[#C51321] mt-9 w-full rounded-full hover:bg-[#858C88]"
                        type="submit"
                    >
                        Sign up
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default SignUpForm;
