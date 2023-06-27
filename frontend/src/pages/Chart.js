import React from 'react';
import { PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell, LineChart, Line, RadialBarChart, RadialBar, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import HeatMap from 'react-heatmap-grid';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#33CC33'];

export const CompaniesBarChart = ({ data }) => {
    let companiesCount = {};

    data.forEach((item) => {
        item.companies.split(', ').forEach(company => {
            companiesCount[company] = (companiesCount[company] || 0) + 1;
        });
    });

    const barData = Object.entries(companiesCount).map(([name, value]) => ({ name, value }));

    return (
        <BarChart
            width={500}
            height={300}
            data={barData}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" />
        </BarChart>
    );
}

export const CompaniesSkillsHeatmap = ({ data }) => {
    let skillsCount = {};
    let companiesCount = {};

    data.forEach((item) => {
        item.skills.split(', ').forEach(skill => {
            skillsCount[skill] = (skillsCount[skill] || 0) + 1;
        });

        item.companies.split(', ').forEach(company => {
            companiesCount[company] = (companiesCount[company] || 0) + 1;
        });
    });

    const skills = Object.keys(skillsCount);
    const companies = Object.keys(companiesCount);
    
    // Creating an array of arrays for the heatmap
    const heatMapData = skills.map(skill => companies.map(company => {
        let count = 0;
        data.forEach(item => {
            if(item.skills.split(', ').includes(skill) && item.companies.split(', ').includes(company)) {
                count++;
            }
        });
        return count;
    }));

    return (
        <div>
            <HeatMap
                xLabels={companies}
                yLabels={skills}
                data={heatMapData}
            />
        </div>
    );
}




export const ExperienceScatterChart = ({ data }) => {
    const scatterData = data.map(item => ({
        name: item.name,
        YearsOfExperience: item.yearsOfExperience
    }));

    return (
        <ScatterChart
            width={400}
            height={400}
            margin={{
                top: 20, right: 20, bottom: 20, left: 20,
            }}
        >
            <CartesianGrid />
            <XAxis type="number" dataKey="YearsOfExperience" name='Years of Experience' unit='yrs' />
            <YAxis type="category" dataKey="name" name='Name' />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name='Resumes' data={scatterData} fill="#0088FE" />
        </ScatterChart>
    );
};

export const SkillsAreaChart = ({ data }) => {
    let skillsCount = {};
    data.forEach((item) => {
        item.skills.split(', ').forEach(skill => {
            skillsCount[skill] = (skillsCount[skill] || 0) + 1;
        });
    });
    const areaData = Object.entries(skillsCount).map(([name, value]) => ({ name, value }));

    return (
        <AreaChart
            width={500}
            height={300}
            data={areaData}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
    );
};


export const ExperienceBarChart = ({ data }) => {
    const barData = data.map(item => ({
        name: item.name,
        YearsOfExperience: item.yearsOfExperience
    }));

    return (
        <BarChart
            width={500}
            height={300}
            data={barData}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="YearsOfExperience" fill="#8884d8" />
        </BarChart>
    );
}

export const SkillsLineChart = ({ data }) => {
    let skillsCount = {};
    data.forEach((item) => {
        item.skills.split(', ').forEach(skill => {
            skillsCount[skill] = (skillsCount[skill] || 0) + 1;
        });
    });
    const lineData = Object.entries(skillsCount).map(([name, value]) => ({ name, value }));

    return (
        <LineChart width={500} height={300} data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    );
};

export const ExperienceRadialBarChart = ({ data }) => {
    const radialData = data.map(item => ({
        name: item.name,
        YearsOfExperience: item.yearsOfExperience
    }));

    
    return (
        <RadialBarChart
            width={500}
            height={300}
            innerRadius="10%"
            outerRadius="80%"
            data={radialData}
            startAngle={180}
            endAngle={0}
        >
            <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#FF8042' }} background clockWise dataKey='YearsOfExperience' />
            <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' wrapperStyle={{ top: 0, right: 0, transform: 'translate(0, 0)' }} />
            <Tooltip />
        </RadialBarChart>
    );
};


const ResumeStatistics = ({ resumes }) => {
    const data = resumes.map(resume => ({
        name: resume.filename,
        yearsOfExperience: resume.yearsOfExperience,
        skills: resume.skills.join(", "),
        companies: resume.companies.join(", ")
    }));

    return (
        <div class = "overflow-auto">
            <h2>Resume Statistics</h2>
        <div class = "d-flex">
            <ExperienceBarChart data={data} />
            <SkillsAreaChart data={data} />
            <CompaniesBarChart data={data} />
        </div>
        <div class = "d-flex">
            
        </div>
        </div>
    )
}


export default ResumeStatistics;
