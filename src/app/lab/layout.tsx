import { LabModeProvider } from "@/context/LabModeContext";

export default function LabLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LabModeProvider>
            {children}
        </LabModeProvider>
    );
}

