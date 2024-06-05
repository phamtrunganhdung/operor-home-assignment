"use client";
import { useEffect } from "react";
import meetings from "./file/meetings.json";
import users from "./file/users.json";

interface Columns {
  label: string;
  dataIndex: string;
  key: string;
  render?: (value: any, record: Users, index: number) => React.ReactNode;
  width?: number;
  align?: string;
}
interface Users {
  days: number;
  email: string;
  first_name: string;
  gender: string;
  id: number;
  ip_address: string;
  last_name: string;
}

interface Meetings {
  end_day: number;
  id: number;
  room_id: number;
  start_day: number;
  user_id: number;
}

export default function Home() {
  const columns: Columns[] = [
    {
      label: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      label: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      label: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      label: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      label: "Gender",
      dataIndex: "gender",
      key: "gender",
      align: "center",
    },
    {
      label: "Days",
      dataIndex: "days",
      key: "days",
      align: "center",
    },
    {
      label: "Meeting Days",
      dataIndex: "meeting_days",
      key: "meeting_days",
      render: (_, r) => {
        const lstMeetings: Meetings[] = meetings.filter(
          (mt: Meetings) => mt.user_id === r.id
        );
        return (
          <div className="grid grid-cols-3 gap-1">
            {lstMeetings.map((mt: Meetings) => {
              return (
                <div
                  className="rounded text-xs font-bold w-full px-1 py-1 bg-neutral-200 text-center"
                  key={mt.id}
                >{`${mt.start_day} -> ${mt.end_day}`}</div>
              );
            })}
          </div>
        );
      },
    },
    {
      label: "Days Without Meetings",
      dataIndex: "days_without__meetings",
      key: "days_without__meetings",
      render: (_, r) =>
        `${meetings.filter((mt: Meetings) => mt.user_id === r.id).length} days`,
      align: "center",
    },
  ];
  useEffect(() => {
    console.log(meetings);
    console.log(users);
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Get & Show data working days
        </h1>
        <div className="overflow-x-auto xl:overflow-x-visible overflow-y-auto h-[70vh]">
          <table className="min-w-full bg-white text-neutral-800">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                {columns.map((hd: Columns) => {
                  return (
                    <th
                      key={hd.key}
                      className={`py-2 px-4 bg-gray-200 text-left
                      border-b
                      ${
                        hd.align === "left"
                          ? "text-left"
                          : hd.align === "right"
                          ? "text-right"
                          : hd.align === "center"
                          ? "text-center"
                          : "text-left"
                      }
                      `}
                    >
                      {hd.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((rc: Users, index: number) => {
                return (
                  <tr key={rc.id}>
                    {columns.map((cl: Columns) => {
                      const value = rc[cl.dataIndex as keyof Users];
                      return (
                        <td
                          key={cl.key}
                          className={`
                          border-b
                          py-2 px-4
                            ${
                              cl.align === "left"
                                ? "text-left"
                                : cl.align === "right"
                                ? "text-right"
                                : cl.align === "center"
                                ? "text-center"
                                : "text-left"
                            }
                            `}
                        >
                          {cl.render ? cl.render(value, rc, index) : value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
