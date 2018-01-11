<?php
/**
 * Created by PhpStorm.
 * User: Emilia
 * Date: 06.11.2017
 * Time: 12:34
 */

namespace AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

class PositionsRepository extends EntityRepository
{
    public function findPointsForLineOlderThanADate($line, $from, $to)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $qb ->select("p.latitude, p.longitude")
            ->from("AppBundle:Positions", "p")
            ->join("p.line","l")
            ->where(
                $qb->expr()->andX(
                $qb->expr()->eq("l.line",":line"),
                $qb->expr()->gte("p.timestamp",":from"),
                $qb->expr()->lte("p.timestamp",":to")

                )
            )
            ->setParameter(":line",$line)
            ->setParameter(":from",$from)
            ->setParameter(":to", $to);

        return $qb->getQuery()->getResult();

    }
}