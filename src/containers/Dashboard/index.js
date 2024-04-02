import { useEffect, useState } from "react";
import Tiles from "../../component/Tiles";
import String from "../../string";
import moment from "moment";
import { useNavigate } from "react-router";
import ApexChart from "./ApexChart";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const navigate = useNavigate();
  const [dahboardjson, setDashboardJson] = useState([
    {
      title: "Total Sales",
      count: 0,
      color: "blue",
      redirect: "/Sales",
    },
    {
      title: "Total Purchae",
      count: 0,
      color: "green",
      redirect: "/Purchase",
    },
    {
      title: "Top Stock",
      count: 0,
      color: "red",
      redirect: "/Stock",
    },
  ]);
  const [timeRange, setTimeRange] = useState("This Week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [profit, setProfit] = useState();
  const getDashboardData = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const url = new URL(`${String.BASE_URL}/dashboard`);
      url.searchParams.append(
        "startdate",
        moment(startDate).format("DD/MM/YYYY")
      );
      url.searchParams.append("enddate", moment(endDate).format("DD/MM/YYYY"));
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        let json = [
          {
            title: "Total Sales",
            count: data.totalsale?.length,
            color: "blue",
            redirect: "/Sales",
          },
          {
            title: "Total Purchae",
            count: data.totalpurchase?.length,
            color: "green",
            redirect: "/Purchase",
          },
          {
            title: "Top Stock",
            count: data.totalstock?.length,
            color: "red",
            redirect: "/Stocks",
          },
        ];
        setDashboardJson(json);
        setDashboardData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getProfit = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const url = new URL(`${String.BASE_URL}/sales/profit`);
      url.searchParams.append(
        "startdate",
        moment(startDate).format("DD/MM/YYYY")
      );
      url.searchParams.append("enddate", moment(endDate).format("DD/MM/YYYY"));
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setProfit(data?.profit);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDashboardData();
    getProfit();
  }, [startDate, endDate]);
  const calculateDates = (timeRange) => {
    let day = 0;
    switch (timeRange) {
      case "Today's":
        day = 0;
        break;
      case "This Week":
        day = 7;
        break;
      case "This Month":
        day = 30;
        break;
      case "Current Year":
        day = 365;
        break;
      default:
        day = 7;
        break;
    }
    setStartDate(moment().subtract(day, "days").format("YYYY-MM-DD"));
    setEndDate(moment().format("YYYY-MM-DD"));
  };
  useEffect(() => {
    document.getElementsByName("apexcharts-bar-area").values = "";
  }, []);
  const handleTimeRangeChange = async(e) => {
    setTimeRange(e.target.value);
  };
  useEffect(()=>{
    calculateDates(timeRange);
  },[timeRange])
  const showTimeRangeFilter = () => {
    return (
      <div className=" row mb-3">
        <div className=" from-group col-md-3">
          <label>Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e)}
            className=" form-control "
          >
            <option value="Today's">Today's</option>
            <option selected value="This Week">
              Last Week
            </option>
            <option value="This Month">Last Month</option>
            <option value="Current Year">Current Year</option>
          </select>
        </div>
        <div className=" from-group col-md-3">
          <label>Start Date</label>
          <input value={startDate} type="date" className=" form-control " />
        </div>
        <div className=" from-group col-md-3">
          <label>End Date</label>
          <input value={endDate} type="date" className=" form-control " />
        </div>
      </div>
    );
  };
  return (
    <div>
      <h4 className=" heading-text mb-3">Dashboard</h4>
      {showTimeRangeFilter()}
      <div className=" row mb-5">
        {dahboardjson.map((e) => {
          const clallBack = () => {
            navigate(e.redirect, {
              state: { startDate: startDate, endDate: endDate },
            });
          };
          return (
            <Tiles
              clickable={true}
              width={200}
              height={50}
              title={e?.title}
              count={e?.count}
              callbackOnClick={clallBack}
              color={e?.color}
            />
          );
        })}
        <Tiles
          clickable={false}
          width={200}
          height={50}
          title={"Profit (In Rupees)"}
          count={profit ? parseFloat(profit).toFixed(2) : 0}
          color={"orange"}
        />
      </div>
      <ApexChart />
    </div>
  );
};

export default Dashboard;
