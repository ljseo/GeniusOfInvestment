package ssafy.GeniusOfInvestment.channel.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import ssafy.GeniusOfInvestment.square_room.dto.response.SquareRoom;

import java.util.List;
import java.util.stream.Collectors;

import static ssafy.GeniusOfInvestment._common.entity.QRoom.room;

@RequiredArgsConstructor
public class ChannelRepositoryImpl implements ChannelRepositoryCustom{

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<SquareRoom> findRoomsStatus0(Long channelNum) {
        return jpaQueryFactory
                .select(
                        room.id,
                        room.title,
                        room.isPublic
                )
                .from(room)
                .where(room.status.eq(0).and(room.channel.id.eq(channelNum)))
                .fetch()
                .stream()
                .map(this::TupleToSquareroom)
                .collect(Collectors.toList());
    }
    private SquareRoom TupleToSquareroom(Tuple tuple){
        return SquareRoom
                .builder()
                    .id(tuple.get(0,Long.class))
                    .title(tuple.get(1,String.class))
                    .isPrivate(!Boolean.TRUE.equals(tuple.get(2, Boolean.class)))
                .build();
    }
}
