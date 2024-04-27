"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { pushData } from "@/actions/dataActions";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile_no: z.string().min(10, "Phone number must be 10 digits").max(10),
  unique_code: z
    .string()
    .length(6, "Unique code must be 6 alphanumeric characters")
    .regex(/^[a-zA-Z0-9]+$/, "Unique code must be alphanumeric"),
});

type FormData = z.infer<typeof schema>;

const WForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const isCodeVerified = verifyCode(data.unique_code);

    if (isCodeVerified) {
      pushData(data, "walkathon");
      router.push(`/${data.unique_code}`);
    } else console.log("error");
  };
  function verifyCode(code: string): boolean {
    if (code.length !== 6) {
      return false;
    }

    const codeWithoutChecksum = code.substring(0, 5);
    const providedChecksum = code.charCodeAt(5) - 65;

    let calculatedChecksum = 0;
    for (let i = 0; i < codeWithoutChecksum.length; i++) {
      calculatedChecksum += parseInt(codeWithoutChecksum[i]);
    }
    calculatedChecksum %= 26;

    if (calculatedChecksum !== providedChecksum) {
      return false;
    }

    return true;
  }

  return (
    <div className="h-screen max:h-screen-auto flex justify-center items-center bg-gradient-to-br from-orange-500/35 via-blue-300 to-purple-400/40">
      <div className="bg-white p-8 rounded-xl shadow-lg mr-3 ml-3 mt-5 mb-5 ">
        <h1 className="font-bold text-3xl text-center m-3">
          Walkathon 15.0 Registrations
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold mb-2">
              Name <span className="text-red-600 font-semibold">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="uniqueCode" className="block font-semibold mb-2">
              Unique Code <span className="text-red-600 font-semibold">*</span>
            </label>
            <input
              type="text"
              id="uniqueCode"
              {...register("unique_code")}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.unique_code ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.unique_code && (
              <p className="text-red-500 mt-1">{errors.unique_code.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block font-semibold mb-2">
              Phone Number <span className="text-red-600 font-semibold">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              {...register("mobile_no")}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.mobile_no ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.mobile_no && (
              <p className="text-red-500 mt-1">{errors.mobile_no.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold mb-2">
              Email ID <span className="text-red-600 font-semibold">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <button type="submit" className="bg-black rounded-lg">
            <span className="bg-orange-400 block p-4 font-semibold text-xl transition-all text-white rounded-lg -translate-y-1 translate-x-0 hover:-translate-y-2 border-2 border-black active:translate-x-0 active:translate-y-0">
              Submit
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default WForm;
