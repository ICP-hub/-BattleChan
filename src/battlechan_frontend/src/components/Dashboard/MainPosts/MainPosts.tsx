import React, { useState, useEffect } from "react";

import { LuPlusCircle } from "react-icons/lu";
import { CgSortAz } from "react-icons/cg";
import { FaAngleDown } from "react-icons/fa6";
import { MdOutlineAddBusiness } from "react-icons/md";

import Post from "./Post";
import Posts from "./Posts";
import Catalog from "./Catalog";
import Pagination from "./Pagination";

import Navbar from "../Navbar/Navbar";
import NavButtons from "../NavButtons/NavButtons";
import CreatePostBtn from "../Body/CreatePostBtn";

import { backend } from "../../../../../declarations/backend";
import { useCanister, useConnect } from "@connect2ic/react";
import PostApiHanlder from "../../../API_Handlers/post";

// Custom hook : initialize the backend Canister
const useBackend = () => {
  return useCanister("backend");
};

function convertNanosecondsToTimestamp(nanoseconds: bigint): string {
  const milliseconds = Number(nanoseconds) / 1000000; // Convert nanoseconds to milliseconds
  const date = new Date(milliseconds); // Convert milliseconds to a Date object

  // Get the month, day, year, hour, and minute from the Date object
  const month = date.toLocaleString("default", { month: "short" }); // Short month name (e.g., Jan)
  const day = date.getDate(); // Day of the month (1-31)
  const year = date.getFullYear(); // Full year (e.g., 2023)
  const hour = date.getHours(); // Hour (0-23)
  const minute = date.getMinutes(); // Minute (0-59)

  // Format the timestamp string
  const timestamp = `${month} ${day},${year}; ${hour}:${minute < 10 ? "0" + minute : minute
    }`;

  return timestamp;
}

type Theme = {
  handleThemeSwitch: Function;
  type?: string;
};

type PostInfo = {
  postId: string;
  postName: string;
  postMetaData: string;
  postDes: string;
  expireAt: BigInt;
  createdAt: string;
  createdBy: {
    userName: string;
    userProfile: string;
  },
  upvotes: number;
};

interface Board {
  boardName: string;
  boardSize: string;
}

interface BackendResponse {
  status: boolean;
  data: Board[][];
  error: string[];
}

interface PostResponse {
  status: boolean;
  data: PostInfo[][];
  error: string[];
}

const MainPosts = (props: Theme) => {
  const [postsData, setPostsData] = useState<PostInfo[]>([]);
  const [boardsData, setBoardsData] = useState<string[]>([]);
  const className = "Dashboard__MainPosts";
  const [backend] = useBackend();
  const { createPost, getBoards, getMainPosts, getArchivePosts } = PostApiHanlder();
  
  useEffect(() => {
    console.log("HERE");
    const fetchData = async () => {
      try {
        console.log("IN FUNC");
        // Make a fetch call to your backend API
        console.log(await getBoards());
        const response = (await getBoards()) as BackendResponse;
        if (response.status == false) {
          throw new Error("Failed to fetch communities");
        }
        const boards = response.data[0];
        if (boards && boards.length > 0) {
          const names = boards.map((board) => board.boardName);
          setBoardsData(names);
          // console.log(names) output=> ['Cinema', 'Crypto', 'Technology', 'Games', 'Sports', 'Politics', 'Business', 'sdf']
        } else {
          console.log("No boards found.");
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (props.type == "archive") {
      getPosts("archive");
    } else {
      getPosts();
    }
  }, [props.type]);

  async function getPosts(postsType?: string) {
    try {
      if (postsType === "archive") {
        const response = (await getArchivePosts()) as PostResponse;
        console.log("Archive Post Response: ", response);
        if (response.status === true && response.data) {
          const posts = response.data
            .flatMap((nestedArray) => nestedArray)
            .flatMap((element) => {
              if (Array.isArray(element) && element.length === 2 && typeof element[1] === 'object') {
                return [element[1]]; // Include only the object part
              }
              return [];
            });
          // console.log(posts);
          posts.forEach((element) => {
            const timestamp: string = convertNanosecondsToTimestamp(BigInt(element.createdAt));
            console.log(timestamp);
            element.createdAt = timestamp;
            element.upvotes = Number(element.upvotes);
          });
          setPostsData(posts);
        }
      } else {
        const response = (await getMainPosts()) as PostResponse;
        console.log("Main Posts Response: ", response);
        if (response.status === true && response.data) {
          // console.log(response);
          const posts = response.data.flat(); // Flatten nested arrays if any
          console.log(posts);
          posts.forEach((element) => {
            console.log("element", element);
            console.log(element.createdAt);
            const timestamp: string = convertNanosecondsToTimestamp(
              BigInt(element.createdAt)
            );
            console.log(timestamp);
            element.createdAt = timestamp;
            element.upvotes = Number(element.upvotes);
          });
          // console.log(posts);
          setPostsData(posts);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  const [isOpen, setIsOpen] = useState(false);
  const [activeSelection, setActiveSelection] = useState("Rank");
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPosts = postsData.length;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = postsData.slice(indexOfFirstPost, indexOfLastPost);
  // console.log(currentPosts);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelection = (selection: string) => {
    setActiveSelection(selection);
    setIsOpen(false);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(totalPosts / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div
        className={`min-h-lvh bg-[#ECECEC] dark:bg-dark dark:bg-green-gradient bg-top bg-contain bg-no-repeat relative`}
      >
        <Navbar handleThemeSwitch={props.handleThemeSwitch} />
        <NavButtons />

        <div
          className={
            className + " " + "px-12 pb-12 dark:text-[#fff] overflow-hidden"
          }
        >
          {/* create post button for desktop  */}
          <div className="mb-4 hidden tablet:flex justify-center">
            <CreatePostBtn />
          </div>

          {/* most popular heading & create post button  */}
          <div className="flex justify-between tablet:justify-center items-center">
            <h1 className="font-bold tablet:text-3xl p-8">
              {props.type === "archive" ? "Archive" : "Most Popular"}
            </h1>
            <button className="tablet:hidden flex items-center justify-center px-4 py-2 bg-[#000] dark:bg-green text-[#fff] rounded-full font-semibold text-xs">
              <LuPlusCircle />
              <span className="ml-1 leading-5">Create Post</span>
            </button>
          </div>

          {/* catalog for desktop  */}
          <div className="pl-10 -mr-2 overflow-hidden">
            <Catalog boardsData={boardsData} />
          </div>

          {/* catalog and pagination and sort for desktop  */}
          <div className="flex justify-between items-center tablet:px-10 py-2">
            {/* catalog and filter button  */}
            <div className="tablet:hidden flex items-center">
              {/* catalog button  */}
              <button className="flex items-center justify-center px-4 py-2 bg-[#000] dark:bg-[#fff] text-[#fff] dark:text-[#000] rounded-full font-semibold text-xs">
                <MdOutlineAddBusiness className="tablet:text-2xl text-lg" />
                <span className="ml-1 leading-5">Business</span>
              </button>

              {/* filter button  */}
              <button className="flex items-center justify-center bg-transparent text-[#000] dark:text-[#fff] dark:text-opacity-50 rounded-md px-1 py-1 text-xs mx-1">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 11 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.55556 2.11133L10 2.11133M1.11111 9.88911L2.77778 9.88911M1.11111 2.11133L3.33333 2.11133M5 9.88911L10 9.88911M8.33333 6.00022L10 6.00022M1.11111 6.00022L6.11111 6.00022"
                    stroke="currentColor"
                    stroke-opacity="0.5"
                    stroke-width="0.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M3.33332 2.11111C3.33332 2.72476 3.83078 3.22222 4.44443 3.22222C5.05808 3.22222 5.55554 2.72476 5.55554 2.11111C5.55554 1.49746 5.05808 1 4.44443 1C3.83078 1 3.33332 1.49746 3.33332 2.11111Z"
                    stroke="currentColor"
                    stroke-opacity="0.5"
                    stroke-width="0.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M6.11115 5.99978C6.11115 6.61343 6.60861 7.11089 7.22226 7.11089C7.83591 7.11089 8.33337 6.61343 8.33337 5.99978C8.33337 5.38613 7.83591 4.88867 7.22226 4.88867C6.60861 4.88867 6.11115 5.38613 6.11115 5.99978Z"
                    stroke="currentColor"
                    stroke-opacity="0.5"
                    stroke-width="0.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M2.77778 9.88894C2.77778 10.5026 3.27524 11.0001 3.88889 11.0001C4.50254 11.0001 5 10.5026 5 9.88894C5 9.27529 4.50254 8.77783 3.88889 8.77783C3.27524 8.77783 2.77778 9.27529 2.77778 9.88894Z"
                    stroke="currentColor"
                    stroke-opacity="0.5"
                    stroke-width="0.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* pagination  */}
            <Pagination
              totalPosts={totalPosts}
              currentPage={currentPage}
              postsPerPage={postsPerPage}
              goToPrevPage={goToPrevPage}
              goToNextPage={goToNextPage}
              goToPage={goToPage}
            />

            {/* sort drop down for desktop  */}
            <div className="hidden tablet:flex justify-end items-center gap-2 tablet:gap-6">
              <div className="flex items-center justify-center gap-1">
                <CgSortAz className="tablet:text-2xl text-sm" />
                <span className="text-xs tablet:text-base">Sort :</span>
              </div>
              {/* drop down button */}
              <div className="-mt-1 tablet:mt-0">
                <button
                  id="sortDropdown"
                  data-dropdown-toggle="dropdown"
                  className="text-[#000] dark:text-[#fff] bg-transparent text-xs tablet:text-base text-center inline-flex items-center gap-4"
                  type="button"
                  onClick={toggleDropdown}
                >
                  {activeSelection}
                  <FaAngleDown />
                </button>
              </div>
            </div>
          </div>
          {/* sort dropdown for mobile */}
          <div className="tablet:hidden flex-row-center justify-end gap-2 my-3">
            <div className="flex-row-center justify-center gap-1">
              <CgSortAz />
              <span className="text-xs tablet:text-base">Sort :</span>
            </div>
            {/* drop down button */}
            <div className="-mt-1">
              <button
                id="sortDropdown"
                data-dropdown-toggle="dropdown"
                className="text-[#000] dark:text-[#fff] bg-transparent text-xs tablet:text-base text-center inline-flex items-center gap-1"
                type="button"
                onClick={toggleDropdown}
              >
                {activeSelection}
                <FaAngleDown />
              </button>
            </div>
          </div>
          {/* sort drop down list  */}
          <div className="flex justify-end tablet:px-20 px-2 absolute right-0">
            {isOpen && (
              <div
                id="sortDropdownList"
                className="z-10 bg-green rounded-lg shadow w-32"
              >
                <ul
                  className=" rounded-lg text-[#000] dark:text-[#fff] text-center overflow-hidden"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <a
                      href="javascript:void(0)"
                      className={`block px-4 py-2 text-[10px] tablet:text-base ${activeSelection === "Rank" ? "bg-[#295A31]" : ""
                        }`}
                      onClick={() => handleSelection("Rank")}
                    >
                      Rank
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0)"
                      className={`block px-4 py-2 text-[10px] tablet:text-base ${activeSelection === "New" ? "bg-[#295A31]" : ""
                        }`}
                      onClick={() => handleSelection("New")}
                    >
                      New
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0)"
                      className={`block px-4 py-2 text-[10px] tablet:text-base ${activeSelection === "Last Reply" ? "bg-[#295A31]" : ""
                        }`}
                      onClick={() => handleSelection("Last Reply")}
                    >
                      Last Reply
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {/* posts  */}
          <div className="xl:px-10 mt-8 flex flex-col flex-wrap laptop:flex-row items-center laptop:justify-start justify-center">
            <Posts currentPosts={currentPosts} type={props.type} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPosts;

// const postsData = [
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Alexander Frem",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
//   {
//     id: "#123056043",
//     imageUrl: "/src/images/main-post-image.jpg",
//     userAvatarUrl: "/src/images/main-post-user-avatar.jpg",
//     userName: "Saurabh Singh",
//     timestamp: "Oct 29, 2023 ; 13:30",
//     duration: "5:00 min",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
//     likes: "250K",
//     comments: 750,
//   },
// ];
