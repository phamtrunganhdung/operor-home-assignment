"use client";
import React, { useState, useEffect, useRef } from "react";
import meetings from "./file/meetings.json";

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
      render: (_, r) => {
        const meetingsOfUser = meetings.filter(
          (mt: Meetings) => mt.user_id === r.id
        );
        if (meetingsOfUser.length === 0) return `${r.days} days`;

        meetingsOfUser.sort((a, b) => a.start_day - b.start_day);

        let totalDays = 0;
        let currentStart = meetingsOfUser[0].start_day;
        let currentEnd = meetingsOfUser[0].end_day;

        for (let i = 1; i < meetingsOfUser.length; i++) {
          if (meetingsOfUser[i].start_day <= currentEnd) {
            currentEnd = Math.max(currentEnd, meetingsOfUser[i].end_day);
          } else {
            totalDays += currentEnd - currentStart + 1;
            currentStart = meetingsOfUser[i].start_day;
            currentEnd = meetingsOfUser[i].end_day;
          }
        }

        totalDays += currentEnd - currentStart + 1;
        // console.log("totalDays", totalDays);

        return `${r.days - totalDays} days`;
      },
      align: "center",
    },
  ];
  const [visibleData, setVisibleData] = useState<Users[]>([]);
  const [count, setCount] = useState<number>(10); // Number of items to load at a time
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<any>(null);

  const Loading = () => {
    return (
      <svg
        className="absolute w-full z-50 h-[45vh] pointer-events-none select-none opacity-50 bg-neutral-500"
        viewBox="0 0 160 160"
      >
        <circle
          cx="80"
          cy="80"
          r="10"
          fill="none"
          stroke="black"
          stroke-width="5"
        />
        <g transform="translate(80, 80)">
          <circle
            cx="0"
            cy="0"
            r="10"
            fill="none"
            stroke="white"
            stroke-width="6"
            stroke-dasharray="0, 345"
            stroke-linecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              begin="0s"
              dur="0.75s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dasharray"
              values="0, 345; 172.5, 172.5; 0, 345"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    );
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setCount(visibleData.length + 10);
    }
  };

  const handleGetUsers = async (count: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workingdays?count=${count}`);
      const data: Users[] = await response.json();
      setVisibleData(data);
      setLoading(false);
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    handleGetUsers(count);
  }, [count]);

  useEffect(() => {
    const container: any = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [visibleData.length]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Get & Show data working days
        </h1>

        <div
          ref={containerRef}
          className="overflow-x-auto xl:overflow-x-visible overflow-y-auto h-[45vh] relative"
        >
          {loading && <Loading />}
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
              {visibleData.map((rc: Users, index: number) => {
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
