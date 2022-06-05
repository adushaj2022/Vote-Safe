import React from "react";
import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { TResultVote, TScore } from "../../types";
import { Center, Flex, HStack, Text, VStack } from "native-base";
import { FontAwesome } from "@expo/vector-icons";

interface ChartResultsProps {
  chartData: TResultVote[];
}

const ChartResults: React.FunctionComponent<ChartResultsProps> = ({
  chartData,
}) => {
  const [scores, setScores] = React.useState<TScore[]>([]);
  function calculateScores() {
    let total = 0;
    let res = [];
    for (let person of chartData) {
      total += person.votes;
    }

    for (let result of chartData) {
      res.push({
        color: result.color,
        name: result.name,
        count: Math.floor((result.votes / total) * 100),
      });
    }

    setScores(res);
  }

  React.useEffect(() => {
    calculateScores();
  }, [chartData]);

  return (
    <>
      <PieChart
        data={chartData}
        height={230}
        width={Dimensions.get("screen").width}
        yAxisLabel={"#"}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="votes"
        backgroundColor="transparent"
        paddingLeft={Dimensions.get("screen").width / 4 + ""}
        hasLegend={false}
      />
      <VStack w="100%" justifyContent="center" d="flex" alignItems="center">
        {scores
          .sort((a, b) => b.count - a.count)
          .map((sc, i) => (
            <HStack
              key={i}
              p={2}
              d="flex"
              alignItems="center"
              // justifyContent="flex-start"
              // w="60%"
            >
              <FontAwesome size={10} name="circle" color={sc.color} />
              <Text pl={2} color={"gray.500"}>
                {sc.count}%
              </Text>
              <Text color={"gray.500"}> {sc.name}</Text>
            </HStack>
          ))}
      </VStack>
    </>
  );
};

export default ChartResults;
