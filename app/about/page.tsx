export default function About() {
    // render content
    return (
        <div className="flex gap-3 flex-col justify-start items-start h-[95%] p-2 w-[85%] text-lg
        overflow-hidden overflow-y-auto">
            <h3 className="text-2xl text-center font-bold my-2 mb-4 h-fit w-full">
                VirgoChat - Elevating Communication Through Smart and Creative Chat Experience
            </h3>
            <p className="p-3 h-fit w-full">
                VirgoChat is a remarkable chat application that seamlessly integrates cutting-edge technologies such as Next.js, React.js, Axios, Tailwind CSS, Pusher, MongoDB, Prisma, Zustand, and TypeScript. This innovative platform delivers a sophisticated and creative communication experience, enabling users to connect, collaborate, and communicate effortlessly.
            </p>
            <h5 className="text-xl font-bold mt-2 h-fit w-fit">
                 Key Features
            </h5>
            <ul className="list-disc list-inside h-fit w-full">
                <li className="list-item px-4">
                    <strong>Secure Authentication:</strong> VirgoChat ensures secure user authentication through JWT tokens and cookies, providing a safe environment for users to connect.
                </li>
                <li className="list-item px-4">
                   <strong>User Registration:</strong> The user-friendly registration form allows seamless onboarding, enabling users to quickly create their accounts and join the VirgoChat community.
                </li>
                <li className="list-item px-4">
                    <strong>Profile Customization:</strong> Users have the freedom to update their profile information, including email, name, username, password, bio, and profile picture, ensuring a personalized experience.
                </li>
                <li className="list-item px-4">
                    <strong>Group Creation:</strong> VirgoChat empowers users to create groups, facilitating efficient collaboration among team members or friends.
                </li>
                <li className="list-item px-4">
                    <strong>User Grouping:</strong> Users can invite other members to their groups, enhancing teamwork and making coordination effortless.
                </li>
                <li className="list-item px-4">
                    <strong>Private Messaging:</strong> The platform allows private messaging, enabling users to communicate privately and effectively with one another.
                </li>
                <li className="list-item px-4">
                    <strong>Smart and Creative Layout:</strong> VirgoChat stands out with its creative and elegant layout design, making communication not only functional but also visually appealing.
                </li>
            </ul>
            <div className="flex flex-col mt-2 h-fit w-full">
                <h5 className="text-xl font-bold h-fit w-fit">
                    Technologies Utilized
                </h5>
                <p className="p-3 h-fit w-full">
                    VirgoChat leverages state-of-the-art technologies to provide a seamless communication experience:
                </p>
            </div>
            <ul className="list-disc list-inside h-fit w-full">
                <li className="list-item px-4">
                    <strong>Next.js:</strong> Next.js brings powerful server-side rendering (SSR) and static site generation (SSG) capabilities, ensuring fast and dynamic web application development.
                </li>
                <li className="list-item px-4">
                    <strong>React.js:</strong> React.js, a widely used JavaScript library for UI development, underpins VirgoChat&apos;s responsive and interactive interface.
                </li>
                <li className="list-item px-4">
                    <strong>Axios:</strong> Axios facilitates smooth API communication, ensuring data exchange is efficient and reliable.
                </li>
                <li className="list-item px-4">
                    <strong>Tailwind CSS:</strong> VirgoChat&apos;s visually appealing and creative design is achieved through Tailwind CSS, a utility-first CSS framework that promotes rapid styling.
                </li>
                <li className="list-item px-4">
                    <strong>Pusher:</strong> Real-time communication is enabled by Pusher, allowing instant message updates and seamless collaboration.
                </li>
                <li className="list-item px-4">
                    <strong>MongoDB:</strong> MongoDB serves as the database backbone, efficiently managing data storage and retrieval.
                </li>
                <li className="list-item px-4">
                    <strong>Prisma:</strong> Prisma streamlines database operations, enhancing data access and manipulation.
                </li>
                <li className="list-item px-4">
                    <strong>Zustand:</strong> Zustand offers minimalistic state management for React applications, guaranteeing smooth user interactions and data synchronization.
                </li>
                <li className="list-item px-4">
                    <strong>TypeScript:</strong> TypeScript enhances code safety and developer productivity, contributing to VirgoChat&apos;s robust and maintainable codebase.
                </li>
            </ul>
            <div className="flex flex-col mt-2 h-fit w-full">
                <h5 className="text-xl font-bold h-fit w-fit">
                    Elevating Communication
                </h5>
                <p className="p-3 h-fit w-full">
                    VirgoChat transforms the way users communicate by amalgamating these technologies into a creative and elegant chat application. Whether it&apos;s private conversations, group discussions, or profile customization, VirgoChat bridges the gap between technology and communication, offering a truly exceptional user experience.
                </p>
            </div>
        </div>
    )
}
